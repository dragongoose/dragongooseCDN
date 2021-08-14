

const socket = io();

socket.on("chartjson", (data) => {




    console.log(socket.id);
    console.log(data)

    var stats = JSON.parse(data)

    var labels = [];
    var chartdata = [];


    var i;
    for (i = 0; i < stats.length; i++) {
        labels.push(stats[i].chartdate);
        chartdata.push(Math.round(stats[i].totalSize / 1000000));
    }

    console.log(chartdata, labels)


    var ctx = document.getElementById('myChart').getContext('2d');

    Chart.defaults.global.defaultFontColor = "#BE007F";
    //Chart.defaults.global.defaultFontStyle = 'Bold'


    var myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],  
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    data: chartdata,
                    backgroundColor: "#BE007F",
                    borderColor: "#BE007F",
                    pointBackgroundColor: "#BE007F",
                    pointBorderColor: "#BE007F",
                    label: "Size (MB)",
                },
            ]
        },
        options: {
            responsive: true,
            layout: { padding: { top: 15 } },
            scales: {
                xAxes: [
                    {
                        gridLines: { display: false },
                        ticks: {
                            fontFamily: "Open Sans",
                            fontStyle: "bold"
                        }
                    },

                ],

                yAxes: [
                    {
                        gridLines: { display: false },
                        ticks: {
                            fontFamily: "Open Sans",
                            fontStyle: "bold"
                        }
                    },
                ],
            },
            plugins: {
                datalabels: { display: false },
            },
            legend: { display: false },
            elements: {
                arc: {},
                point: {},
                line: { tension: 0.2, fill: false },
                rectangle: {},
            },
            tooltips: {
                intersect: false,
                backgroundColor: "#141418",
                titleFontColor: "#BE007F",
                titleFontFamily: "Merriweather Sans",
                titleFontSize: 14,
                bodyFontColor: "#BE007F",
                bodyFontFamily: "Lato",
                cornerRadius: 3,
            },
            hover: {
                mode: "nearest",
                animationDuration: 300,
            },
        }
    });
});

