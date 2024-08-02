document.addEventListener('DOMContentLoaded', function() {
    M.updateTextFields();
});

function calculateGrowth() {
    const accounts = document.querySelectorAll('.account');
    const startAge = parseInt(document.getElementById('startAge').value);
    const endAge = parseInt(document.getElementById('endAge').value);
    const years = endAge - startAge;
    let data = [];
    let labels = [];
    let balances = {};
    let totalContributions = {};
    let totalReturns = {};

    accounts.forEach(account => {
        const id = account.id.split('-')[1];
        const labelElement = document.getElementById(`accountLabel-${id}`);
        const label = labelElement ? labelElement.value : `Account ${id}`;
        let initialBalance = parseFloat(document.getElementById(`initialBalance-${id}`).value);
        let annualContribution = parseFloat(document.getElementById(`annualContribution-${id}`).value);
        let annualReturnRate = parseFloat(document.getElementById(`annualReturnRate-${id}`).value) / 100;
        let contributionIncrease = parseFloat(document.getElementById(`contributionIncrease-${id}`).value) || 0;

        balances[label] = [initialBalance];
        totalContributions[label] = annualContribution;
        totalReturns[label] = [];

        for (let year = 1; year <= years; year++) {
            let previousBalance = balances[label][year - 1];
            let endOfYearBalance = previousBalance + annualContribution;
            let returnAmount = endOfYearBalance * annualReturnRate;
            balances[label].push(endOfYearBalance + returnAmount);
            annualContribution += contributionIncrease;
            totalReturns[label].push(returnAmount);
        }
    });

    for (let year = 1; year <= years; year++) {
        let row = [startAge + year - 1, startAge + year - 1];
        let totalBalance = 0;
        let totalAnnualReturns = 0;
        let totalAnnualContributions = 0;
        let totalMonthlyContributions = 0;

        Object.keys(balances).forEach(label => {
            row.push(Math.round(balances[label][year]).toLocaleString());
            totalBalance += balances[label][year];
            totalAnnualReturns += totalReturns[label][year - 1];
            totalAnnualContributions += totalContributions[label];
            totalMonthlyContributions += totalContributions[label] / 12;
        });

        row.push(`<span class="positive">+${Math.round(totalAnnualReturns).toLocaleString()}</span>`);
        row.push(Math.round(totalAnnualContributions).toLocaleString());
        row.push(Math.round(totalMonthlyContributions).toLocaleString());
        row.push(`<span class="highlight">+${Math.round(totalBalance).toLocaleString()}</span>`);
        data.push(row);
        labels.push(startAge + year - 1);
    }

    const resultTableBody = document.getElementById('resultTableBody');
    resultTableBody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.innerHTML = cell;
            tr.appendChild(td);
        });
        resultTableBody.appendChild(tr);
    });

    createChart(labels, balances);

    document.getElementById('achievementsList').innerHTML = `<li class="collection-item achievement-item"><span>You have achieved a significant milestone!</span></li>`;
}