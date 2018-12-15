fixNewLines = (doc) => {
    /**
     * Fixes newline in whatsapp chat.
     * Returns array of lines.
     */

    let lines = doc.split('\n');
    let check = 0;

    while(true) {
        for (let i = 1; i < lines.length - 2; i++) {
            if(lines[i] === '') {
                lines[i-1] += " " + lines[i+1];
                lines = lines.slice(0, i).concat(lines.slice(i+2));
                check = 0;
                break;
            } else if(isNaN(lines[i].charAt(0)) && (!(lines[i].charAt(1) == '/'))) {
                lines[i-1] += lines[i];
                lines = lines.slice(0, i).concat(lines.slice(i+1));
                check = 0;
                break;
            }
            check = 1;
        }

        if(check == 1) {
            break;
        }
    }

    return lines;
}

removeDates = (doc) => {
    /**
     * Removes dates from the messages to get 'user: message' format
     * Returns array of array of messages with dates removed and array of dates/timings.
     */

    const lines = fixNewLines(doc);

    let temp = [], dates = [];

    for (let i = 0; i < lines.length; i++) {
        try {
            const lineList = lines[i].split(' - ');
            const nonDatePart = lineList.slice(1);
            const datePart = lineList.slice(0, 1);
            dates.push(datePart);
            temp.push(nonDatePart.join(' - '));
        }
        catch(err) {
            console.log(err.message);
        }
    }

    return [temp, dates];
}

getUsers = (lines) => {
    /**
     * Get the list of users for the whatsapp chat in question.
     * Returns array of usernames.
     */

    let temp = [];

    for (let i = 0; i < lines.length; i++) {
        if(lines[i].includes(':')) {
            const usr = lines[i].split(': ')[0];

            if(!temp.includes(usr)) {
                temp.push(usr);
            }
        }
    }

    return temp;
}

getData = (usrs, lines) => {
    /**
     * Get data from the messages.
     * Returns array of:
     *      array of messages sent, words used, and media sent for each user
     *      array of all the words user in the chat
     *      array of timings after removing date part
     */

    let msgs = new Array(usrs.length);
    msgs.fill(0);
    let wrds = new Array(usrs.length);
    wrds.fill(0);
    let mda = new Array(usrs.length);
    mda.fill(0);

    let times = [];

    let words = [];
    const letters = /^[0-9a-zA-Z]+$/;

    for(let i = 0; i < lines.length; i++) {
        const spl = lines[i].split(': ');
        if(spl.length == 1) {
            /**
             * Continue if it is not a message. Example: 'XYZ changed the group icon.', etc
             */
            continue;
        }

        const usr = spl[0];
        const message = spl.slice(1).join(': ');
        msgs[usrs.indexOf(usr)]++;
        times.push(i);

        if(message === "<Media omitted>") {
            /** Added Media */
            mda[usrs.indexOf(usr)]++;
            continue;
        } 

        if(message === "This message was deleted") {continue};

        // wrds[usrs.indexOf(usr)] += message.split(' ').length;
        const msg_ct = message.split(' ');
        wrds[usrs.indexOf(usr)] += msg_ct.length;

        for(let j = 0; j < msg_ct.length; j++) {
            if(msg_ct[j].match(letters)){
                words.push(msg_ct[j]);
            }
        }
    }

    return [msgs, wrds, mda, words, times];
}

getTopUsedWords = (words, minLength) => {
    /**
     * Get the array of most top 10 used words above length minLength, and the number of times each of them is used.
     */
    let satWords = [];
    for(let i = 0; i < words.length; i++) {
        if(words[i].length >= minLength) {
            satWords.push(words[i]);
        }
    }

    let counts = {};
    for(let i = 0; i < satWords.length; i++) {
        const wrd = satWords[i];
        counts[wrd] = counts[wrd] ? counts[wrd] + 1 : 1;
    }

    let sortable = [];
    for (let word in counts) {
        sortable.push([word, counts[word]]);
    }

    sortable.sort((a, b) => {
        return b[1] - a[1];
    });

    const top = sortable.slice(0, 10);
    let lWords = [], lCount = [];
    for(let i = 0; i < top.length; i++) {
        lWords.push(top[i][0]);
        lCount.push(top[i][1]);
    }

    return [lWords, lCount];
}

getTimes = (dates, crr_times) => {
    /**
     * Get timings only for lines with line number in crr_times (to avoid non-message content)
     */
    let listOfTimings = [];
    let hours = new Array(24);
    hours.fill(0);

    for(let i = 0; i < crr_times.length; i++) {
        try {
            let temp = [];
            temp = dates[crr_times[i]][0].split(', ').slice(1);
            listOfTimings.push(temp[0]);
        } catch(err) {
            console.log(err.type);
        }
    }

    let letters = /^[A-Za-z]+$/

    for(let i = 0; i < listOfTimings.length; i++){
        try{
            try {
                temp = listOfTimings[i].split(" ");
                const hour = parseInt(temp[0].split(":")[0], 10);
                const m = temp[1];

                if(m.match(letters)){
                    if(m === "PM") {
                        hours[hour+12]++;
                    } else if(m === "AM") {
                        hours[hour]++;
                    }
                }
            } catch(err) {
                const hour = parseInt(listOfTimings[i].split(":")[0], 10);
                hours[hour]++;
            }
        } catch(err) {
            console.log(err.type);
        }
    }

    return hours.slice(0, 24);
}

main = (doc) => {
    const temp =  removeDates(doc);
    const lines = temp[0];
    const dates = temp[1];

    const users = getUsers(lines);

    const data = getData(users, lines);
    const crr_times = data[4];

    const topWords = getTopUsedWords(data[3], 4);

    const times = getTimes(dates, crr_times);

    return [users, data[0], data[1], data[2], topWords, times];
}

add = (a, b) => {
    return a+b;
}

graphData = (anadata) => {
    let users = anadata[0];
    let msgs = anadata[1];
    let wrds = anadata[2];
    let mda = anadata[3];

    const total_msgs = msgs.reduce(add);
    const total_wrds = wrds.reduce(add);
    const total_mda = mda.reduce(add);

    const msgs_msg = "Accounts for media and deleted messages too | Total Messages: " + total_msgs;
    const wrds_msg = "Total Words: " + total_wrds;
    const mda_msg = "Total Media: " + total_mda;

    let ctx_msgs = document.getElementById("msgs").getContext('2d');
    let msgChart = new Chart(ctx_msgs, {
        type: (users.length > 6) ? 'horizontalBar' : 'bar',
        data: {
            labels: users,
            datasets: [{
                label: '# of Messages',
                data: msgs,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: msgs_msg
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    let ctx_wrds = document.getElementById("wrds").getContext('2d');
    let wrdsChart = new Chart(ctx_wrds, {
        type: (users.length > 6) ? 'horizontalBar' : 'bar',
        data: {
            labels: users,
            datasets: [{
                label: '# of Words',
                data: wrds,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: wrds_msg
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    let ctx_mda = document.getElementById("mda").getContext('2d');
    let mdaChart = new Chart(ctx_mda, {
        type: 'pie',
        data: {
            labels: users,
            datasets: [{
                label: '# of Media',
                data: mda,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: mda_msg
            },
        }
    });
}

graphTopWords = (anadata) => {
    let words = anadata[4];

    let ctx_msgs = document.getElementById("topWords").getContext('2d');
    let msgChart = new Chart(ctx_msgs, {
        type: 'horizontalBar',
        data: {
            labels: words[0],
            datasets: [{
                label: 'Top Used Words (length 4+)',
                data: words[1],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}

graphTimings = (anadata) => {
    let times = anadata[5];
    let timesLabel = new Array(24);
    timesLabel.fill('');

    for(let j = 0; j < timesLabel.length; j++) {
        if(j > 12) {
            timesLabel[j] += (j%12) + ' PM';
            continue;
        } else if(j == 12) {
            timesLabel[j] += '12 PM';
        } else {
            timesLabel[j] += j + ' AM';
        }
    }

    let ctx_times = document.getElementById("times").getContext('2d');
    let timesChart = new Chart(ctx_times, {
        type: 'line',
        data: {
            labels: timesLabel,
            datasets: [{
                label: 'Timings Stats',
                data: times,
                backgroundColor: 'rgba(19, 144, 119,  0.4)',
                borderColor: 'rgba(19, 144, 119,  1)',
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Accounts for media and deleted messages too'
            },
            responsive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Messages'
                    }
                }]
            }
        }
    });
}



const input = document.querySelector('input[type="file"]');

input.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {

        const result = main(reader.result);

        $(document).ready(
            function () {
                $(".graph, .initial").fadeToggle(100);
                graphData(result);
                graphTopWords(result);
                graphTimings(result);
            }
        )

        // console.log(result);
    }
}, false);