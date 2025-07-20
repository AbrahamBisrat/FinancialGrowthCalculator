// --- Dynamic Account Management ---
const defaultAccounts = [
  { type: 'Roth IRA', initial: 0, annual: 6000, rate: 7, increase: 0 },
  { type: '401k', initial: 10000, annual: 19500, rate: 7, increase: 0 },
  { type: 'Brokerage', initial: 5000, annual: 10000, rate: 7, increase: 500 },
];

let accounts = [];

function renderAccounts() {
  const container = document.getElementById('accountsContainer');
  container.innerHTML = '';
  accounts.forEach((acc, idx) => {
    container.innerHTML += `
      <div class="card-panel z-depth-1 account-panel" style="margin-bottom: 20px; position: relative;">
        <div class="row">
          <div class="input-field col s12 m4">
            <input type="text" value="${acc.type}" onchange="updateAccountType(${idx}, this.value)">
            <label class="active">Account Name</label>
          </div>
          <div class="input-field col s12 m2">
            <input type="number" value="${acc.initial}" onchange="updateAccountField(${idx}, 'initial', this.value)">
            <label class="active">Initial Balance ($)</label>
          </div>
          <div class="input-field col s12 m2">
            <input type="number" value="${acc.annual}" onchange="updateAccountField(${idx}, 'annual', this.value)">
            <label class="active">Annual Contribution ($)</label>
          </div>
          <div class="input-field col s12 m2">
            <input type="number" value="${acc.increase}" onchange="updateAccountField(${idx}, 'increase', this.value)">
            <label class="active">Annual Contribution Increase ($)</label>
          </div>
          <div class="input-field col s12 m2">
            <input type="number" step="0.01" value="${acc.rate}" onchange="updateAccountField(${idx}, 'rate', this.value)">
            <label class="active">Annual Return Rate (%)</label>
          </div>
        </div>
        <button type="button" class="btn-flat btn-small grey lighten-2 waves-effect waves-grey" style="position: absolute; top: 8px; right: 8px; min-width: 32px; width: 32px; height: 32px; padding: 0; border-radius: 50%;" onclick="removeAccount(${idx})" title="Remove Account">
          <i class="material-icons" style="color: #888; font-size: 20px;">close</i>
        </button>
      </div>
    `;
  });
  // Fix Materialize label overlap
  if (window.M && M.updateTextFields) M.updateTextFields();
}

function updateAccountType(idx, value) {
  accounts[idx].type = value;
}
function updateAccountField(idx, field, value) {
  accounts[idx][field] = parseFloat(value);
}
function removeAccount(idx) {
  accounts.splice(idx, 1);
  renderAccounts();
}
function addAccount() {
  accounts.push({ type: 'New Account', initial: 0, annual: 6000, rate: 7, increase: 0 });
  renderAccounts();
}

function sampleTemplate() {
  accounts = [
    { type: 'Roth IRA', initial: 0, annual: 6500, rate: 7, increase: 0 },
    { type: '401k', initial: 10000, annual: 22500, rate: 7, increase: 0 },
    { type: 'Brokerage', initial: 5000, annual: 12000, rate: 7, increase: 500 },
  ];
  renderAccounts();
  calculateGrowth();
}

document.addEventListener('DOMContentLoaded', function() {
  accounts = JSON.parse(JSON.stringify(defaultAccounts));
  renderAccounts();
  document.getElementById('addAccountBtn').addEventListener('click', addAccount);
  document.getElementById('sampleTemplateBtn').addEventListener('click', sampleTemplate);
});

// --- Chart.js Integration ---
let growthChart = null;
function renderGrowthChart(labels = [], datasets = []) {
  const ctx = document.getElementById('growthChart').getContext('2d');
  if (growthChart) growthChart.destroy();
  growthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Account Growth Over Time' }
      },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => '$' + v.toLocaleString() } }
      }
    }
  });
}

// --- Calculation Placeholder ---
function calculateGrowth() {
  const startAge = parseInt(document.getElementById('startAge').value);
  const endAge = parseInt(document.getElementById('endAge').value);
  const years = endAge - startAge + 1;

  // Prepare per-account arrays for balances
  let accountBalances = accounts.map(acc => [acc.initial]);
  let accountContributions = accounts.map(acc => [0]);
  let milestones = [];
  let millionaireAchieved = false;
  let tenMillionAchieved = false;
  let hundredMillionAchieved = false;

  // For each year, calculate balances
  for (let year = 1; year < years; year++) {
    accounts.forEach((acc, i) => {
      let prevBalance = accountBalances[i][year - 1];
      let prevContribution = accountContributions[i][year - 1];
      let annualContribution = acc.annual + (acc.increase || 0) * (year - 1);
      let endOfYearBalance = prevBalance + annualContribution;
      let returnAmount = endOfYearBalance * (acc.rate / 100);
      let newBalance = endOfYearBalance + returnAmount;
      accountBalances[i][year] = newBalance;
      accountContributions[i][year] = annualContribution;
    });
  }

  // Render table header dynamically
  const headerRow = document.getElementById('resultsTableHeaderRow');
  headerRow.innerHTML = '';
  headerRow.innerHTML += '<th>Year</th><th>Age</th>';
  accounts.forEach(acc => {
    headerRow.innerHTML += `<th>${acc.type} Balance ($)</th>`;
  });
  headerRow.innerHTML += '<th class="highlight">Annual Returns ($)</th>';
  headerRow.innerHTML += '<th>Annual Contributions ($)</th>';
  headerRow.innerHTML += '<th>Monthly Contributions ($)</th>';
  headerRow.innerHTML += '<th class="highlight">Total Balance ($)</th>';

  // Prepare table data
  const resultTableBody = document.getElementById('resultTableBody');
  resultTableBody.innerHTML = '';
  for (let year = 1; year < years; year++) { // start from 1, skip year 0
    const age = startAge + year;
    let row = document.createElement('tr');
    if ((year + 1) % 5 === 0) row.classList.add('milestone');
    let totalAnnualReturns = 0;
    let totalAnnualContributions = 0;
    let totalBalance = 0;
    // Year, Age
    row.innerHTML += `<td>${year}</td><td>${age}</td>`;
    // Account balances
    accounts.forEach((acc, i) => {
      let bal = accountBalances[i][year] || 0;
      row.innerHTML += `<td>${Math.round(bal).toLocaleString()}</td>`;
      totalBalance += bal;
      if (year > 0) {
        let prev = accountBalances[i][year - 1] || 0;
        totalAnnualReturns += bal - prev - (accountContributions[i][year] || 0);
        totalAnnualContributions += accountContributions[i][year] || 0;
      }
    });
    // Annual Returns
    row.innerHTML += `<td class="highlight">+${Math.round(totalAnnualReturns).toLocaleString()}</td>`;
    // Annual Contributions
    row.innerHTML += `<td>${Math.round(totalAnnualContributions).toLocaleString()}</td>`;
    // Monthly Contributions
    row.innerHTML += `<td>${Math.round(totalAnnualContributions / 12).toLocaleString()}</td>`;
    // Total Balance
    row.innerHTML += `<td class="highlight">${Math.round(totalBalance).toLocaleString()}</td>`;
    resultTableBody.appendChild(row);

    // Milestones
    if (!millionaireAchieved && totalBalance >= 1000000) {
      milestones.push(`You became a millionaire at age ${age}`);
      millionaireAchieved = true;
    } else if (!tenMillionAchieved && totalBalance >= 10000000) {
      milestones.push(`You reached 10 million at age ${age}`);
      tenMillionAchieved = true;
    } else if (!hundredMillionAchieved && totalBalance >= 100000000) {
      milestones.push(`You reached 100 million at age ${age}`);
      hundredMillionAchieved = true;
    }
  }

  // Achievements
  const achievementsList = document.getElementById('achievementsList');
  achievementsList.innerHTML = '';
  milestones.forEach(milestone => {
    const li = document.createElement('li');
    li.classList.add('collection-item', 'achievement-item');
    li.innerHTML = `<span>${milestone}</span>`;
    achievementsList.appendChild(li);
  });

  // Chart
  const labels = Array.from({length: years - 1}, (_, i) => `${startAge + i + 1}`);
  const datasets = accounts.map((acc, i) => ({
    label: acc.type,
    data: accountBalances[i].slice(1),
    borderColor: `hsl(${i * 80}, 70%, 50%)`,
    fill: false,
    tension: 0.2
  }));
  renderGrowthChart(labels, datasets);
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    html2canvas(document.body).then(canvas => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.save('financial_growth_calculator.pdf');
    });
}
