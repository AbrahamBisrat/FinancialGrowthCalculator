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
  const numYears = endAge - startAge;

  if (numYears <= 0) {
    document.getElementById('resultTableBody').innerHTML = '';
    document.getElementById('finalTotalBalance').style.display = 'none';
    renderGrowthChart([], []);
    return;
  }

  let accountBalances = accounts.map(acc => {
      const balances = new Array(numYears + 1).fill(0);
      balances[0] = acc.initial;
      return balances;
  });
  
  let yearlyContributions = accounts.map(() => new Array(numYears + 1).fill(0));
  
  for (let year = 1; year <= numYears; year++) {
    accounts.forEach((acc, i) => {
      const prevBalance = accountBalances[i][year - 1];
      const currentContribution = acc.annual + (acc.increase || 0) * (year - 1);
      yearlyContributions[i][year] = currentContribution;
      const balanceBeforeReturn = prevBalance + currentContribution;
      const returnAmount = balanceBeforeReturn * (acc.rate / 100);
      accountBalances[i][year] = balanceBeforeReturn + returnAmount;
    });
  }

  const headerRow = document.getElementById('resultsTableHeaderRow');
  headerRow.innerHTML = `<th>Year</th><th>Age</th>`;
  accounts.forEach(acc => {
    headerRow.innerHTML += `<th>${acc.type} Balance ($)</th>`;
  });
  headerRow.innerHTML += `<th class="highlight">Annual Returns ($)</th><th>Annual Contributions ($)</th><th>Monthly Contributions ($)</th><th class="highlight">Total Balance ($)</th>`;

  const resultTableBody = document.getElementById('resultTableBody');
  resultTableBody.innerHTML = '';
  let milestones = [];
  let achievedMilestones = new Set();

  for (let year = 1; year <= numYears; year++) {
    const age = startAge + year;
    const row = document.createElement('tr');
    
    let totalBalanceForYear = 0;
    let totalContributionsForYear = 0;
    let totalReturnsForYear = 0;

    accounts.forEach((acc, i) => {
      const endBalance = accountBalances[i][year];
      const startBalance = accountBalances[i][year - 1];
      const contribution = yearlyContributions[i][year];
      totalBalanceForYear += endBalance;
      totalContributionsForYear += contribution;
      totalReturnsForYear += (endBalance - startBalance - contribution);
    });
    
    let rowHTML = `<td>${year}</td><td>${age}</td>`;
    accounts.forEach((_, i) => {
      rowHTML += `<td>${Math.round(accountBalances[i][year]).toLocaleString()}</td>`;
    });
    rowHTML += `<td class="highlight">+${Math.round(totalReturnsForYear).toLocaleString()}</td>`;
    rowHTML += `<td>${Math.round(totalContributionsForYear).toLocaleString()}</td>`;
    rowHTML += `<td>${Math.round(totalContributionsForYear / 12).toLocaleString()}</td>`;
    rowHTML += `<td class="highlight">$${Math.round(totalBalanceForYear).toLocaleString()}</td>`;
    row.innerHTML = rowHTML;

    const milestoneThresholds = { 100000: "$100k", 1000000: "$1M", 10000000: "$10M", 100000000: "$100M" };
    for (const threshold in milestoneThresholds) {
        if (totalBalanceForYear >= threshold && !achievedMilestones.has(threshold)) {
            milestones.push(`You reached ${milestoneThresholds[threshold]} at age ${age}`);
            row.classList.add('milestone');
            achievedMilestones.add(threshold);
        }
    }
    resultTableBody.appendChild(row);
  }

  const achievementsList = document.getElementById('achievementsList');
  achievementsList.innerHTML = '';
  milestones.forEach(milestone => {
    const li = document.createElement('li');
    li.classList.add('collection-item', 'achievement-item');
    li.innerHTML = `<span>${milestone}</span>`;
    achievementsList.appendChild(li);
  });

  const chartLabels = Array.from({length: numYears + 1}, (_, i) => `${startAge + i}`);
  const datasets = accounts.map((acc, i) => ({
    label: acc.type,
    data: accountBalances[i],
    borderColor: `hsl(${i * 80}, 70%, 50%)`,
    fill: false,
    tension: 0.2
  }));
  renderGrowthChart(chartLabels, datasets);

  const finalTotalDiv = document.getElementById('finalTotalBalance');
  const finalTotal = accountBalances.reduce((sum, arr) => sum + (arr[numYears] || 0), 0);
  finalTotalDiv.style.display = 'block';
  finalTotalDiv.innerHTML = `Total Accumulated Wealth: <span style='color:#1b5e20;'>$${Math.round(finalTotal).toLocaleString()}</span><br><span style='font-size:1.1rem;font-weight:400;color:#388e3c;'>This is your reward for all your investing!</span>`;
}

function generatePDF() {
  const pdfBtn = document.querySelector('.generate-pdf-btn');
  if (!pdfBtn) return;
  pdfBtn.disabled = true;
  pdfBtn.innerHTML = '<i class="material-icons left">hourglass_empty</i>Generating...';

  function doGenerate() {
    const doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const chartCanvas = document.getElementById('growthChart');
    const table = document.querySelector('.results-table');

    // Helper to add a title
    function addTitle() {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('Financial Growth Report', 40, 50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Generated on: ' + new Date().toLocaleString(), 40, 70);
    }

    // Render chart to image and add to PDF
    html2canvas(chartCanvas, { backgroundColor: '#fff', scale: 2 }).then(chartCanvasImg => {
      const chartImgData = chartCanvasImg.toDataURL('image/png');
      addTitle();
      doc.addImage(chartImgData, 'PNG', 40, 90, 500, 180);

      // Prepare table data for autoTable
      const headerCells = Array.from(table.querySelectorAll('thead tr th'));
      const headers = headerCells.map(th => th.innerText);
      const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
      const body = bodyRows.map(row => Array.from(row.querySelectorAll('td')).map(td => td.innerText));

      // Add table using autoTable
      if (doc.autoTable) {
        doc.autoTable({
          head: [headers],
          body: body,
          startY: 290,
          theme: 'grid',
          headStyles: { fillColor: [34, 51, 77], textColor: 255, fontStyle: 'bold', fontSize: 11 },
          bodyStyles: { fontSize: 10, textColor: 34 },
          styles: { cellPadding: 4, overflow: 'linebreak', halign: 'right', valign: 'middle', lineColor: [191,201,209], lineWidth: 0.7 },
          alternateRowStyles: { fillColor: [245, 247, 250] },
          margin: { left: 40, right: 40 },
          tableWidth: 'auto',
        });
        doc.save('FinancialGrowthReport.pdf');
        pdfBtn.disabled = false;
        pdfBtn.innerHTML = '<i class="material-icons left">download</i>Generate PDF';
      } else {
        alert('PDF table export is not available.');
        pdfBtn.disabled = false;
        pdfBtn.innerHTML = '<i class="material-icons left">download</i>Generate PDF';
      }
    }).catch(() => {
      alert('Failed to generate chart image for PDF.');
      pdfBtn.disabled = false;
      pdfBtn.innerHTML = '<i class="material-icons left">download</i>Generate PDF';
    });
  }

  // Check if autoTable is loaded, if not, load it
  if (!window.jspdf || !window.jspdf.jsPDF || !window.jspdf.jsPDF.prototype.autoTable) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.0/jspdf.plugin.autotable.min.js';
    script.onload = doGenerate;
    document.body.appendChild(script);
  } else {
    doGenerate();
  }
}
