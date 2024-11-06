from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

@app.route('/track', methods=['GET'])
def track_pdf_open():
    user_ip = request.remote_addr
    access_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    with open("pdf_access_log.txt", "a") as log_file:
        log_file.write(f"PDF opened at {access_time} from IP: {user_ip}\n")
    
    return "Tracking successful", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8443)
