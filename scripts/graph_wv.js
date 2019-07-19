graphData = (anadata) => {
    let users = anadata[0];
    let msgs = anadata[1];
    let wrds = anadata[2];
    let mda = anadata[3];

    const total_msgs = (msgs.length == 0) ? 0 : msgs.reduce(add);
    const total_wrds = (wrds.length == 0) ? 0 : wrds.reduce(add);
    const total_mda = (mda.length == 0) ? 0 : mda.reduce(add);

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
                label: 'Top Used Words (length 3+)',
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

graphDates = (anadata) => {
    let dateCounts = anadata[6];

    let ctx_datetimes = document.getElementById("plotDates").getContext('2d');
    let datetimesChart = new Chart(ctx_datetimes, {
        type: 'line',
        data: {
            labels: Object.keys(dateCounts),
            datasets: [{
                label: 'Date Stats',
                data: Object.values(dateCounts),
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
                        labelString: 'Date (MM-DD-YY)'
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
                $(".graph, .initial").fadeToggle();
                graphData(result);
                graphTopWords(result);
                graphTimings(result);
                graphDates(result);
            }
        )
    }
}, false);
