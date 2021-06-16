

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

    Chart.defaults.global.defaultFontColor = "#df49a6";
    //Chart.defaults.global.defaultFontStyle = 'Bold'


    var myChart = new Chart(ctx, {
        plugins: [ChartDataLabels],  
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    data: chartdata,
                    backgroundColor: "#fa14e7",
                    borderColor: "#df49a6",
                    pointBackgroundColor: "#db34d3",
                    pointBorderColor: "#ab4aa6",
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
                titleFontColor: "#df49a6",
                titleFontFamily: "Merriweather Sans",
                titleFontSize: 14,
                bodyFontColor: "#df49a6",
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