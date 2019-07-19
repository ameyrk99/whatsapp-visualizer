fixNewLines = (doc) => {
    /**
     * Fixes newline in whatsapp chat.
     * Returns array of lines.
     */

    let lines = doc.split('\n');
    let check = 0;

    while (true) {
        for (let i = 1; i < lines.length - 2; i++) {
            if (lines[i] === '') {
                lines[i - 1] += " " + lines[i + 1];
                lines = lines.slice(0, i).concat(lines.slice(i + 2));
                check = 0;
                break;
            } else if (isNaN(lines[i].charAt(0)) && (!(lines[i].charAt(1) == '/'))) {
                lines[i - 1] += lines[i];
                lines = lines.slice(0, i).concat(lines.slice(i + 1));
                check = 0;
                break;
            }
            check = 1;
        }

        if (check == 1) {
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
        catch (err) {
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
        if (lines[i].includes(':')) {
            const usr = lines[i].split(': ')[0];

            if (!temp.includes(usr)) {
                temp.push(usr);
            }
        }
    }

    return temp;
}

countElements = (arr) => {
    /* Get the count of elements in an array (here dates) */

    let counts = {};

    for (let i = 0; i < arr.length; i++) {
        let num = arr[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    return counts;
}

getData = (usrs, lines) => {
    /**
     * Get data from the messages.
     * Returns array of:
     *      array of messages sent, words used, and media sent for each user
     *      array of all the words user in the chat
     *      array of timings after removing date part
     *      array of datetimes
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

    for (let i = 0; i < lines.length; i++) {
        const spl = lines[i].split(': ');
        if (spl.length == 1) {
            /**
             * Continue if it is not a message. Example: 'XYZ changed the group icon.', etc
             */
            continue;
        }

        const usr = spl[0];
        const message = spl.slice(1).join(': ');
        msgs[usrs.indexOf(usr)]++;
        times.push(i);

        if (message === "<Media omitted>") {
            /** Added Media */
            mda[usrs.indexOf(usr)]++;
            continue;
        }

        if (message === "This message was deleted") { continue };

        // wrds[usrs.indexOf(usr)] += message.split(' ').length;
        const msg_ct = message.split(' ');
        wrds[usrs.indexOf(usr)] += msg_ct.length;

        for (let j = 0; j < msg_ct.length; j++) {
            if (msg_ct[j].match(letters)) {
                words.push(msg_ct[j].toLowerCase());
            }
        }
    }

    return [msgs, wrds, mda, words, times];
}

const stopwords = ["a's", 'able', 'about', 'above', 'according', 'accordingly', 'across', 'actually', 'after',
    'afterwards', 'again', 'against', "ain't", 'all', 'allow', 'allows', 'almost', 'alone', 'along', 'already',
    'also', 'although', 'always', 'am', 'among', 'amongst', 'an', 'and', 'another', 'any', 'anybody', 'anyhow',
    'anyone', 'anything', 'anyway', 'anyways', 'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'are',
    "aren't", 'around', 'as', 'aside', 'ask', 'asking', 'associated', 'at', 'available', 'away', 'awfully', 'be',
    'became', 'because', 'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being',
    'believe', 'below', 'beside', 'besides', 'best', 'better', 'between', 'beyond', 'both', 'brief', 'but',
    'by', "c'mon", "c's", 'came', 'can', "can't", 'cannot', 'cant', 'cause', 'causes', 'certain', 'certainly',
    'changes', 'clearly', 'co', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering',
    'contain', 'containing', 'contains', 'corresponding', 'could', "couldn't", 'course', 'currently', 'definitely',
    'described', 'despite', 'did', "didn't", 'different', 'do', 'does', "doesn't", 'doing', "don't", 'done', 'down',
    'downwards', 'during', 'each', 'edu', 'eg', 'eight', 'either', 'else', 'elsewhere', 'enough', 'entirely',
    'especially', 'et', 'etc', 'even', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'ex',
    'exactly', 'example', 'except', 'far', 'few', 'fifth', 'first', 'five', 'followed', 'following', 'follows',
    'for', 'former', 'formerly', 'forth', 'four', 'from', 'further', 'furthermore', 'get', 'gets', 'getting', 'given',
    'gives', 'go', 'goes', 'going', 'gone', 'got', 'gotten', 'greetings', 'had', "hadn't", 'happens', 'hardly', 'has',
    "hasn't", 'have', "haven't", 'having', 'he', "he's", 'hello', 'help', 'hence', 'her', 'here', "here's", 'hereafter',
    'hereby', 'herein', 'hereupon', 'hers', 'herself', 'hi', 'him', 'himself', 'his', 'hither', 'hopefully', 'how',
    'howbeit', 'however', "i'd", "i'll", "i'm", "i've", 'ie', 'if', 'ignored', 'immediate', 'in', 'inasmuch', 'inc',
    'indeed', 'indicate', 'indicated', 'indicates', 'inner', 'insofar', 'instead', 'into', 'inward', 'is', "isn't",
    'it', "it'd", "it'll", "it's", 'its', 'itself', 'just', 'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'last',
    'lately', 'later', 'latter', 'latterly', 'least', 'less', 'lest', 'let', "let's", 'like', 'liked', 'likely',
    'little', 'look', 'looking', 'looks', 'ltd', 'mainly', 'many', 'may', 'maybe', 'me', 'mean', 'meanwhile', 'merely',
    'might', 'more', 'moreover', 'most', 'mostly', 'much', 'must', 'my', 'myself', 'name', 'namely', 'nd', 'near',
    'nearly', 'necessary', 'need', 'needs', 'neither', 'never', 'nevertheless', 'new', 'next', 'nine', 'no', 'nobody',
    'non', 'none', 'noone', 'nor', 'normally', 'not', 'nothing', 'novel', 'now', 'nowhere', 'obviously', 'of', 'off',
    'often', 'oh', 'ok', 'okay', 'old', 'on', 'once', 'one', 'ones', 'only', 'onto', 'or', 'other', 'others', 'otherwise',
    'ought', 'our', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'own', 'particular', 'particularly', 'per',
    'perhaps', 'placed', 'please', 'plus', 'possible', 'presumably', 'probably', 'provides', 'que', 'quite', 'qv', 'rather',
    'rd', 're', 'really', 'reasonably', 'regarding', 'regardless', 'regards', 'relatively', 'respectively', 'right',
    'said', 'same', 'saw', 'say', 'saying', 'says', 'second', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming',
    'seems', 'seen', 'self', 'selves', 'sensible', 'sent', 'serious', 'seriously', 'seven', 'several', 'shall', 'she',
    'should', "shouldn't", 'since', 'six', 'so', 'some', 'somebody', 'somehow', 'someone', 'something', 'sometime',
    'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'sub', 'such',
    'sup', 'sure', "t's", 'take', 'taken', 'tell', 'tends', 'th', 'than', 'thank', 'thanks', 'thanx', 'that', "that's",
    'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there', "there's", 'thereafter', 'thereby',
    'therefore', 'therein', 'theres', 'thereupon', 'these', 'they', "they'd", "they'll", "they're", "they've", 'think',
    'third', 'this', 'thorough', 'thoroughly', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'to',
    'together', 'too', 'took', 'toward', 'towards', 'tried', 'tries', 'truly', 'try', 'trying', 'twice', 'two', 'un', 'under',
    'unfortunately', 'unless', 'unlikely', 'until', 'unto', 'up', 'upon', 'us', 'use', 'used', 'useful', 'uses', 'using',
    'usually', 'value', 'various', 'very', 'via', 'viz', 'vs', 'want', 'wants', 'was', "wasn't", 'way', 'we', "we'd", "we'll",
    "we're", "we've", 'welcome', 'well', 'went', 'were', "weren't", 'what', "what's", 'whatever', 'when', 'whence', 'whenever',
    'where', "where's", 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 'whether', 'which', 'while',
    'whither', 'who', "who's", 'whoever', 'whole', 'whom', 'whose', 'why', 'will', 'willing', 'wish', 'with', 'within',
    'without', "won't", 'wonder', 'would', "wouldn't", 'yes', 'yet', 'you', "you'd", "you'll", "you're", "you've", 'your',
    'yours', 'yourself', 'yourselves', 'zero'];

getTopUsedWords = (words, minLength) => {
    /**
     * Get the array of most top 10 used words above length minLength, and the number of times each of them is used.
     */
    let satWords = [];
    for (let i = 0; i < words.length; i++) {
        if (words[i].length >= minLength && !stopwords.includes(words[i])) {
            satWords.push(words[i]);
        }
    }

    let counts = {};
    for (let i = 0; i < satWords.length; i++) {
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

    let top = [];
    try {
        top = sortable.slice(0, 10);
    } catch (err) {
        top = sortable;
    }

    let lWords = [], lCount = [];
    for (let i = 0; i < top.length; i++) {
        lWords.push(top[i][0]);
        lCount.push(top[i][1]);
    }

    return [lWords, lCount];
}

getDateCounts = (dates, crr_times) => {
    /**
     * Get the date counts
     */
    let datetimes = [];
    let formattedDate = "";

    for (let i = 0; i < crr_times.length; i++) {
        try {
            let datePart = dates[crr_times[i]];
            if (datePart != "") {
                formattedDate = datePart[0].split(", ").join(" ");
                formattedDate = formattedDate.split(" ")[0];
            }

            if (formattedDate != "NaN-NaN-NaN") {
                datetimes.push(formattedDate);
            }
        } catch (err) {
            console.log(err);
            console.log("Could be a problem on line " + i.toString() + " of target file.");
            console.log(err.type);
        }
    }

    
    let datetimesCounted = countElements(datetimes);
    return datetimesCounted;
}

getTimes = (dates, crr_times) => {
    /**
     * Get timings only for lines with line number in crr_times (to avoid non-message content)
     */
    let listOfTimings = [];
    let hours = new Array(24);
    hours.fill(0);

    for (let i = 0; i < crr_times.length; i++) {
        try {
            let temp = [];
            temp = dates[crr_times[i]][0].split(', ').slice(1);
            listOfTimings.push(temp[0]);
        } catch (err) {
            console.log(err.type);
        }
    }

    let letters = /^[A-Za-z]+$/

    for (let i = 0; i < listOfTimings.length; i++) {
        try {
            try {
                temp = listOfTimings[i].split(" ");
                const hour = parseInt(temp[0].split(":")[0], 10);
                const m = temp[1];

                if (m.match(letters)) {
                    if (m === "PM") {
                        hours[hour + 12]++;
                    } else if (m === "AM") {
                        hours[hour]++;
                    }
                }
            } catch (err) {
                const hour = parseInt(listOfTimings[i].split(":")[0], 10);
                hours[hour]++;
            }
        } catch (err) {
            console.log(err.type);
        }
    }

    return hours.slice(0, 24);
}

add = (a, b) => {
    return a + b;
}

main = (doc) => {
    const temp = removeDates(doc);
    const lines = temp[0];
    const dates = temp[1];

    const users = getUsers(lines);

    const data = getData(users, lines);
    const crr_times = data[4];

    const topWords = getTopUsedWords(data[3], 3);

    const times = getTimes(dates, crr_times);
    const dateCounts = getDateCounts(dates, crr_times);

    return [users, data[0], data[1], data[2], topWords, times, dateCounts];
}

