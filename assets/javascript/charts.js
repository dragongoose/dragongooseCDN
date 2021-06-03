var ctx = document.getElementById('myChart').getContext('2d');

Chart.defaults.global.defaultFontColor = "#df49a6";
//Chart.defaults.global.defaultFontStyle = 'Bold'

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
        ],
        datasets: [
            {
                data: [0, 60, 100, 150, 300, 340, 400],
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
                    fontFamily: "Open Sans",
                    fontStyle: "bold"
                },

            ],

            yAxes: [
                {
                    gridLines: { display: false },
                    fontFamily: "Open Sans",
                    fontStyle: "bold"
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