import pikepdf
from pikepdf import Pdf

# Open the PDF to modify
pdf = Pdf.open("11391xxx_DALI_PushDim-B.pdf")

# JavaScript to trigger on PDF open/close
js = """
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://yourserver.com:8443/track', true);
xhr.send(null);
"""

# Convert the JavaScript string to bytes
js_bytes = js.encode('utf-8')

# Embed the JavaScript in the PDF to execute on opening
pdf.Root.OpenAction = pdf.make_stream(js_bytes)

# Optionally, embed the JavaScript to execute on closing
pdf.Root.CloseAction = pdf.make_stream(js_bytes)

# Save the modified PDF with tracking
pdf.save("Tracked_PDF.pdf")

print("Tracking JavaScript embedded successfully.")
