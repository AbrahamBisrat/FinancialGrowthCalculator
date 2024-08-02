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
    let contributions = {};
    let returns = {};
    let totalContributions = 0;
    let totalMonthlyContributions = 0;

    accounts.forEach(account => {
        const id = account.id.split('-')[1];
        const label = document.getElementById(`accountLabel-${id}`).value;
        balances[label] = new Array(years).fill(0);
        balances[label][0] = parseFloat(document.getElementById(`initialBalance-${id}`).value);
        contributions[label] = parseFloat(document.getElementById(`annualContribution-${id}`).value);
        returns[label] = parseFloat(document.getElementById(`annualReturnRate-${id}`).value) / 100;
        let contributionIncrease = parseFloat(document.getElementById(`contributionIncrease-${id}`).value) || 0;

        for (let year = 1; year <= years; year++) {
            const previousBalance = balances[label][year - 1];
            const endOfYearBalance = previousBalance + contributions[label];
            const returnAmount = endOfYearBalance * returns[label];
            balances[label][year] = endOfYearBalance + returnAmount;
            contributions[label] += contributionIncrease;
            totalContributions += contributions[label];
            totalMonthlyContributions += contributions[label] / 12;
        }
    });

    for (let year = 1; year <= years; year++) {
        const row = [startAge + year - 1, startAge + year - 1];
        Object.keys(balances).forEach(label => {
            row.push(Math.round(balances[label][year]).toLocaleString());
        });
        row.push(`<span class="positive">+${Math.round(totalContributions).toLocaleString()}</span>`);
        row.push(Math.round(totalContributions).toLocaleString());
        row.push(Math.round(totalMonthlyContributions).toLocaleString());
        row.push(`<span class="highlight">+${Math.round(Object.values(balances).reduce((sum, balance) => sum + balance[year], 0)).toLocaleString()}</span>`);
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