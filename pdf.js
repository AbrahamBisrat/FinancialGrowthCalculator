function generatePDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.html(document.getElementById('pdf-content'), {
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