const { PDFDocument, PDFName, PDFString } = require('pdf-lib');
const fs = require('fs');

async function addJavaScriptToPDF() {
  // Load the existing PDF
  const existingPdfBytes = fs.readFileSync('11391xxx_DALI_PushDim-B.pdf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Define JavaScript code
  const jsCode = `
    var myTimeout = setTimeout(function() {
      app.alert('JavaScript executed silently.');
    }, 1000);
  `;

  // Create a JavaScript action object
  const jsAction = pdfDoc.context.obj({
    Type: 'Action',
    S: 'JavaScript',
    JS: PDFString.of(jsCode),
  });

  // Add the JavaScript action to the PDF's catalog
  pdfDoc.catalog.set(PDFName.of('OpenAction'), jsAction);

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('output_with_js.pdf', pdfBytes);

  console.log('JavaScript added to PDF successfully.');
}

// Execute the function
addJavaScriptToPDF();
