import requests
import sys

def verify_report():
    try:
        # Assuming server is running at localhost:8000
        url = "http://localhost:8000/api/v1/reports/project/1/master"
        print(f"Requesting PDF from {url}...")
        res = requests.get(url)
        
        if res.status_code == 200:
            if res.headers['content-type'] == 'application/pdf':
                print(f"✅ Success! Received PDF ({len(res.content)} bytes)")
                print(f"Header: {res.content[:5]}") # Should be %PDF-
            else:
                print(f"❌ Error: Content-Type is {res.headers['content-type']}")
        elif res.status_code == 404:
             print("⚠️ Project 1 not found or no data. Trying creating dummy data first if needed. Skipping for now.")
        else:
            print(f"❌ Failed with status {res.status_code}: {res.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    verify_report()
