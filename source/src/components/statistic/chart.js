import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getWatchedMovies} from '../../utils/statistic';

export const generateChart = (ctx, period, movies) => {
  const getGenreLabels = () => {
    return [...new Set(movies
      .map((movie) => movie.genres)
      .reduce((acc, genres) => [...acc, ...genres], []))];
  };

  const watchedMovies = getWatchedMovies(movies, period);
  const getChartData = getGenreLabels()
    .map((genre) => watchedMovies
      .reduce((acc, film) => acc + [...film.genres]
        .filter((it) => it === genre).length, 0));

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,

    data: {
      labels: getGenreLabels(),
      datasets: [{
        backgroundColor: `#ffe800`,
        data: getChartData,
      }]
    },

    options: {
      plugins: {
        datalabels: {
          display: true,
          anchor: `start`,
          align: `start`,
          offset: 20,
          color: `white`,
          font: {
            family: `'Open Sans', 'sans-serif'`,
            size: 20
          }
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);

            return `${tooltipData} MOVIES - ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        titleAlign: `center`,
        bodyAlign: `center`,
        xPadding: 15,
        yPadding: 5,
        bodyFontSize: 16,
        borderWidth: 1
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          position: `top`,
          ticks: {
            display: false,
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            fontFamily: `'Open Sans', 'sans-serif'`,
            fontSize: 20,
            fontColor: `white`,
            padding: 50
          }
        }]
      }
    }
  });
};
