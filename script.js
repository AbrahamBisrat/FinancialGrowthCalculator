document.addEventListener('DOMContentLoaded', function() {
    M.updateTextFields();
    addInitialAccounts();
});

let accountId = 0;

function addInitialAccounts() {
    addAccount('Roth IRA', 0, 6000, 7);
    addAccount('401k', 10000, 19500, 7);
    addAccount('Brokerage', 5000, 10000, 7, 500);
}

function addAccount(name = '', initialBalance = '', annualContribution = '', annualReturnRate = '', contributionIncrease = '') {
    const accountSection = document.createElement('div');
    accountSection.classList.add('account-section');
    accountSection.id = `account${accountId}`;
    accountSection.innerHTML = `
        <h4 class="section-title">Account ${accountId + 1} <span class="account-remove-btn" onclick="removeAccount(${accountId})">Remove</span></h4>
        <div class="row">
            <div class="input-field col s12 m6">
                <input type="text" id="accountName${accountId}" value="${name}" class="validate">
                <label for="accountName${accountId}">Account Name</label>
            </div>
            <div class="input-field col s12 m6">
                <input type="number" id="initialBalance${accountId}" value="${initialBalance}" class="validate">
                <label for="initialBalance${accountId}">Initial Balance ($)</label>
            </div>
            <div class="input-field col s12 m6">
                <input type="number" id="annualContribution${accountId}" value="${annualContribution}" class="validate">
                <label for="annualContribution${accountId}">Annual Contribution ($)</label>
            </div>
            <div class="input-field col s12 m6">
                <input type="number" step="0.01" id="annualReturnRate${accountId}" value="${annualReturnRate}" class="validate">
                <label for="annualReturnRate${accountId}">Annual Return Rate (%)</label>
            </div>
            <div class="input-field col s12 m6">
                <input type="number" id="contributionIncrease${accountId}" value="${contributionIncrease}" class="validate">
                <label for="contributionIncrease${accountId}">Annual Contribution Increase ($)</label>
            </div>
        </div>
    `;
    document.getElementById('accounts').appendChild(accountSection);
    M.updateTextFields();
    accountId++;
}

function removeAccount(id) {
    const accountSection = document.getElementById(`account${id}`);
    accountSection.remove();
}

function calculateGrowth() {
    const startAge = parseInt(document.getElementById('startAge').value);
    const endAge = parseInt(document.getElementById('endAge').value);
    const years = endAge - startAge;
    let data = [];
    let milestones = [];
    let millionaireAchieved = false;
    let tenMillionAchieved = false;
    let hundredMillionAchieved = false;

    for (let i = 0; i < accountId; i++) {
        const accountName = document.getElementById(`accountName${i}`).value;
        let initialBalance = parseFloat(document.getElementById(`initialBalance${i}`).value);
        let annualContribution = parseFloat(document.getElementById(`annualContribution${i}`).value);
        const annualReturnRate = parseFloat(document.getElementById(`annualReturnRate${i}`).value) / 100;
        const contributionIncrease = parseFloat(document.getElementById(`contributionIncrease${i}`).value) || 0;

        for (let year = 1; year <= years; year++) {
            const previousBalance = initialBalance;
            const endOfYearBalance = previousBalance + annualContribution;
            const returnAmount = endOfYearBalance * annualReturnRate;
            initialBalance = endOfYearBalance + returnAmount;
            annualContribution += contributionIncrease;

            const totalAnnualReturns = returnAmount;
            const totalAnnualContributions = annualContribution;
            const totalMonthlyContributions = totalAnnualContributions / 12;
            const totalBalance = initialBalance;

            const rowClass = (year % 5 === 0) ? 'milestone' : '';
            data.push([
                startAge + year - 1,
                startAge + year - 1,
                accountName,
                Math.round(totalBalance).toLocaleString(),
                `<span class="positive">+${Math.round(totalAnnualReturns).toLocaleString()}</span>`,
                Math.round(totalAnnualContributions).toLocaleString(),
                Math.round(totalMonthlyContributions).toLocaleString(),
                `<span class="highlight">+${Math.round(totalBalance).toLocaleString()}</span>`,
                rowClass
            ]);

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
    }

    const resultTableBody = document.getElementById('resultTableBody');
    resultTableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        if (row[8]) tr.classList.add(row[8]);
        row.slice(0, 8).forEach(cell => {
            const td = document.createElement('td');
            td.innerHTML = cell;
            tr.appendChild(td);
        });
        resultTableBody.appendChild(tr);
    });

    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    milestones.forEach(milestone => {
        const li = document.createElement('li');
        li.classList.add('collection-item', 'achievement-item');
        li.innerHTML = `<span>${milestone}</span>`;
        achievementsList.appendChild(li);
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    html2canvas(document.body, {
        scale: 2
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        doc.save('financial_growth_calculator.pdf');
    });
}