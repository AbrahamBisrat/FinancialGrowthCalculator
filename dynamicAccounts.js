let accountCounter = 0;

document.addEventListener('DOMContentLoaded', () => {
    addSampleAccount('Roth IRA', 0, 6000, 7);
});

function addAccount() {
    accountCounter++;
    const accountHTML = `
        <div class="account" id="account-${accountCounter}">
            <h4 class="section-title"><input type="text" id="accountLabel-${accountCounter}" value="Account ${accountCounter}" class="validate"> <button type="button" class="btn red btn-remove" onclick="removeAccount(${accountCounter})">Remove</button></h4>
            <div class="row">
                <div class="input-field col s12 m6">
                    <input type="number" id="initialBalance-${accountCounter}" class="validate">
                    <label for="initialBalance-${accountCounter}" class="active">Initial Balance ($)</label>
                </div>
                <div class="input-field col s12 m6">
                    <input type="number" id="annualContribution-${accountCounter}" class="validate">
                    <label for="annualContribution-${accountCounter}" class="active">Annual Contribution ($)</label>
                </div>
                <div class="input-field col s12 m6">
                    <input type="number" step="0.01" id="annualReturnRate-${accountCounter}" class="validate">
                    <label for="annualReturnRate-${accountCounter}" class="active">Annual Return Rate (%)</label>
                </div>
                <div class="input-field col s12 m6">
                    <input type="number" id="contributionIncrease-${accountCounter}" class="validate">
                    <label for="contributionIncrease-${accountCounter}" class="active">Annual Contribution Increase ($)</label>
                </div>
            </div>
        </div>
    `;
    document.getElementById('accountsContainer').insertAdjacentHTML('beforeend', accountHTML);
    M.updateTextFields(); // Ensure labels are properly aligned
}

function removeAccount(accountId) {
    document.getElementById(`account-${accountId}`).remove();
}

function populateSampleData() {
    document.getElementById('accountsContainer').innerHTML = ''; // Clear existing accounts
    accountCounter = 0;
    addSampleAccount('Roth IRA', 0, 6000, 7);
    addSampleAccount('401k', 10000, 19500, 7);
    addSampleAccount('Brokerage', 5000, 10000, 7, 500);
}

function addSampleAccount(label, initialBalance, annualContribution, annualReturnRate, contributionIncrease = 0) {
    accountCounter++;
    const accountHTML = `
        <div class="account" id="account-${accountCounter}">
            <h4 class="section-title">${label} <button type="button" class="btn red btn-remove" onclick="removeAccount(${accountCounter})">Remove</button></h4>
            <div class="row">
                <div class="input-field col s12 m6">
                    <input type="number" id="initialBalance-${accountCounter}" value="${initialBalance}" class="validate">
                    <label for="initialBalance-${accountCounter}" class="active">Initial Balance ($)</label>
                </div>
                <div class="input-field col s12 m6">
                    <input type="number" id="annualContribution-${accountCounter}" value="${annualContribution}" class="validate">
                    <label for="annualContribution-${accountCounter}" class="active">Annual Contribution ($)</label>
                </div>
                <div class="input-field col s12 m6">
                    <input type="number" step="0.01" id="annualReturnRate-${accountCounter}" value="${annualReturnRate}" class="validate">
                    <label for="annualReturnRate-${accountCounter}" class="active">Annual Return Rate (%)</label>
                </div>
                <div class="input-field col s12 m6">
                    <input type="number" id="contributionIncrease-${accountCounter}" value="${contributionIncrease}" class="validate">
                    <label for="contributionIncrease-${accountCounter}" class="active">Annual Contribution Increase ($)</label>
                </div>
            </div>
        </div>
    `;
    document.getElementById('accountsContainer').insertAdjacentHTML('beforeend', accountHTML);
    M.updateTextFields(); // Ensure labels are properly aligned
}