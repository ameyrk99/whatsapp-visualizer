fixNewLines = (doc) => {
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
    const lines = fixNewLines(doc);

    let temp = [];

    for (let i = 0; i < lines.length; i++) {
        try {
            const lineList = lines[i].split(' - ');
            const datePart = lineList.slice(1);
            temp.push(datePart.join(' - '));
        }
        catch(err) {
            console.log(err.message);
        }
    }

    return temp;
}

getUsers = (lines) => {
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
    let msgs = new Array(usrs.length);
    msgs.fill(0);
    let wrds = new Array(usrs.length);
    wrds.fill(0);
    let mda = new Array(usrs.length);
    mda.fill(0);

    let words = [];
    const letters = /^[0-9a-zA-Z]+$/;

    for(let i = 0; i < lines.length; i++) {
        const spl = lines[i].split(': ');
        const usr = spl[0];
        const message = spl.slice(1).join(': ');
        msgs[usrs.indexOf(usr)]++;

        if(message === "<Media omitted>") {
            mda[usrs.indexOf(usr)]++;
            continue;
        } 

        if(message === "This message was deleted") {continue};

        wrds[usrs.indexOf(usr)] += message.split(' ').length;
        const msg_ct = message.split(' ');
        for(let j = 0; j < msg_ct.length; j++) {
            if(msg_ct[j].match(letters)){
                words.push(msg_ct[j]);
            }
        }
    }

    return [msgs, wrds, mda, words];
}

getTopUsedWords = (words, minLength) => {
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

    return sortable.slice(0, 10);
}

main = (doc) => {
    const lines = removeDates(doc);

    const users = getUsers(lines);

    const data = getData(users, lines);

    const topWords = getTopUsedWords(data[3], 4);

    return [users, data[0], data[1], data[2], topWords];
}

graphData = (anadata) => {
    var users = anadata[0];
    var msgs = anadata[1];
    var wrds = anadata[2];
    var mda = anadata[3];

    var ctx_msgs = document.getElementById("msgs").getContext('2d');
    var msgChart = new Chart(ctx_msgs, {
        type: 'bar',
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
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var ctx_wrds = document.getElementById("wrds").getContext('2d');
    var wrdsChart = new Chart(ctx_wrds, {
        type: 'bar',
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
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var ctx_mda = document.getElementById("mda").getContext('2d');
    var mdaChart = new Chart(ctx_mda, {
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
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
            }]
        },
        options: {
            responsive: true,
        }
    });
}

graphTopWords = (anadata) => {
    var words = anadata[4];

    var ctx_msgs = document.getElementById("topWords").getContext('2d');
    var msgChart = new Chart(ctx_msgs, {
        type: 'horizontalBar',
        data: {
            labels: words[0],
            datasets: [{
                label: 'Top Used Words',
                data: words[1],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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


const input = document.querySelector('input[type="file"]');

input.addEventListener('change', (e) => {
    console.log(input.files);
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {

        const result = main(reader.result);
        graphData(result);
        // graphTopWords(result);

        console.log(result);
    }
}, false);