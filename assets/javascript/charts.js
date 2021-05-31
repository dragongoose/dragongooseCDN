var ctx = document.getElementById('myChart').getContext('2d');

Chart.defaults.global.defaultFontColor = "#df49a6";
//Chart.defaults.global.defaultFontStyle = 'Bold'

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            },
            pointLabels :{
                fontStyle: "bold",
            },     
            xAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    fontFamily: "Open Sans",
                    fontStyle: "bold"
                }
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    fontFamily: "Open Sans",
                    fontStyle: "bold"
                }   
            }],
            plugins: {
                legend: {
                    labels: {
                        // This more specific font property overrides the global property
                        font: {
                            size: 14
                        }
                    }
                }
            }
        },
        legend: {
            display: false
         }
    }
});