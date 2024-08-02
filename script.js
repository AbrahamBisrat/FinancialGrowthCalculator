document.addEventListener('DOMContentLoaded', function() {
    M.updateTextFields();
});

function calculateGrowth() {
    // Retrieve input values for various accounts
    const initialBalanceRoth = parseFloat(document.getElementById('initialBalanceRoth').value);
    const annualContributionRoth = parseFloat(document.getElementById('annualContributionRoth').value);
    const annualReturnRateRoth = parseFloat(document.getElementById('annualReturnRateRoth').value) / 100;
    
    const initialBalance401k = parseFloat(document.getElementById('initialBalance401k').value);
    const annualContribution401k = parseFloat(document.getElementById('annualContribution401k').value);
    const annualReturnRate401k = parseFloat(document.getElementById('annualReturnRate401k').value) / 100;
    
    const initialBalanceBrokerage = parseFloat(document.getElementById('initialBalanceBrokerage').value);
    const annualContributionBrokerage = parseFloat(document.getElementById('annualContributionBrokerage').value);
    const contributionIncreaseBrokerage = parseFloat(document.getElementById('contributionIncreaseBrokerage').value);
    const annualReturnRateBrokerage = parseFloat(document.getElementById('annualReturnRateBrokerage').value) / 100;

    const startAge = parseInt(document.getElementById('startAge').value);
    const endAge = parseInt(document.getElementById('endAge').value);
    const years = endAge - startAge;

    let data = [];
    let balanceRoth = initialBalanceRoth;
    let balance401k = initialBalance401k;
    let balanceBrokerage = initialBalanceBrokerage;
    let annualContributionBrokerageCurrent = annualContributionBrokerage;

    let milestones = [];
    let millionaireAchieved = false;
    let tenMillionAchieved = false;
    let hundredMillionAchieved = false;

    let labels = [];
    let rothData = [];
    let k401Data = [];
    let brokerageData = [];

    // Loop through each year to calculate balances and returns
    for (let year = 1; year <= years; year++) {
        // Calculate Roth IRA balance and returns
        const previousBalanceRoth = balanceRoth;
        const endOfYearBalanceRoth = previousBalanceRoth + annualContributionRoth;
        const returnAmountRoth = endOfYearBalanceRoth * annualReturnRateRoth;
        balanceRoth = endOfYearBalanceRoth + returnAmountRoth;

        // Calculate 401k balance and returns
        const previousBalance401k = balance401k;
        const endOfYearBalance401k = previousBalance401k + annualContribution401k;
        const returnAmount401k = endOfYearBalance401k * annualReturnRate401k;
        balance401k = endOfYearBalance401k + returnAmount401k;

        // Calculate Brokerage balance and returns
        const previousBalanceBrokerage = balanceBrokerage;
        const endOfYearBalanceBrokerage = previousBalanceBrokerage + annualContributionBrokerageCurrent;
        const returnAmountBrokerage = endOfYearBalanceBrokerage * annualReturnRateBrokerage;
        balanceBrokerage = endOfYearBalanceBrokerage + returnAmountBrokerage;
        annualContributionBrokerageCurrent += contributionIncreaseBrokerage;

        // Calculate total annual returns and contributions
        const totalAnnualReturns = returnAmountRoth + returnAmount401k + returnAmountBrokerage;
        const totalAnnualContributions = annualContributionRoth + annualContribution401k + annualContributionBrokerageCurrent;
        const totalMonthlyContributions = totalAnnualContributions / 12;
        const totalBalance = balanceRoth + balance401k + balanceBrokerage;

        // Determine row class for milestones
        const rowClass = (year % 5 === 0) ? 'milestone' : '';

        // Append data for the current year
        data.push([
            year,
            startAge + year - 1,
            Math.round(balanceRoth).toLocaleString(),
            Math.round(balance401k).toLocaleString(),
            Math.round(balanceBrokerage).toLocaleString(),
            `<span class="positive">+${Math.round(totalAnnualReturns).toLocaleString()}</span>`,
            Math.round(totalAnnualContributions).toLocaleString(),
            Math.round(totalMonthlyContributions).toLocaleString(),
            `<span class="highlight">+${Math.round(totalBalance).toLocaleString()}</span>`,
            rowClass
        ]);

        labels.push(startAge + year - 1);
        rothData.push(balanceRoth);
        k401Data.push(balance401k);
        brokerageData.push(balanceBrokerage);

        // Track milestones (e.g., millionaire, 10 million, 100 million, etc.)
        if (!millionaireAchieved && totalBalance >= 1000000) {
            milestones.push(`You became a millionaire at age ${startAge + year - 1}`);
            millionaireAchieved = true;
        } else if (!tenMillionAchieved && totalBalance >= 10000000) {
            milestones.push(`You reached 10 million at age ${startAge + year - 1}`);
            tenMillionAchieved = true;
        } else if (!hundredMillionAchieved && totalBalance >= 100000000) {
            milestones.push(`You reached 100 million at age ${startAge + year - 1}`);
            hundredMillionAchieved = true;
        }
    }

    // Populate the results table
    const resultTableBody = document.getElementById('resultTableBody');
    resultTableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        if (row[9]) tr.classList.add(row[9]);
        row.slice(0, 9).forEach(cell => {
            const td = document.createElement('td');
            td.innerHTML = cell;
            tr.appendChild(td);
        });
        resultTableBody.appendChild(tr);
    });

    // Populate the achievements section
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    milestones.forEach(milestone => {
        const li = document.createElement('li');
        li.classList.add('collection-item', 'achievement-item');
        li.innerHTML = `<span>${milestone}</span>`;
        achievementsList.appendChild(li);
    });

    // Create the chart
    createChart(labels, rothData, k401Data, brokerageData);
}

function createChart(labels, rothData, k401Data, brokerageData) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    if (window.growthChart) {
        window.growthChart.destroy();
    }
    window.growthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Roth IRA',
                    data: rothData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: '401k',
                    data: k401Data,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Brokerage',
                    data: brokerageData,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: false,
                    tension: 0.1
                }
            ]
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

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.html(document.body, {
        callback: function (pdf) {
            pdf.save('financial_growth_calculator.pdf');
        },
        x: 10,
        y: 10,
        html2canvas: {
            scale: 0.75
        }
    });
}