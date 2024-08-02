function createChart(labels, balances) {
    const ctx = document.getElementById('growthChart');
    if (!ctx) return;
    const chartContext = ctx.getContext('2d');
    if (window.growthChart) {
        window.growthChart.destroy();
    }
    const datasets = Object.keys(balances).map((label, i) => {
        return {
            label: label,
            data: balances[label],
            borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
            fill: false,
            tension: 0.1
        };
    });

    window.growthChart = new Chart(chartContext, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                        mode: 'xy'
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Age'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Balance ($)'
                    }
                }
            }
        }
    });
}