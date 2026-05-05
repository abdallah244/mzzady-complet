import requests
import time
from datetime import datetime

# URLs to monitor
URLS_TO_MONITOR = [
    {"name": "Backend API", "url": "https://backend-mzzady.vercel.app/api"},
    {"name": "Frontend Site", "url": "https://mazzady.works"}
]

# Monitoring interval in seconds
CHECK_INTERVAL = 60 

def check_status():
    print(f"\n--- Checking Status at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---")
    for site in URLS_TO_MONITOR:
        try:
            response = requests.get(site["url"], timeout=10)
            if response.status_code == 200:
                print(f"[OK] {site['name']} is UP! ({site['url']}) - Status: {response.status_code}")
            else:
                print(f"[WARNING] {site['name']} returned status code {response.status_code} ({site['url']})")
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] {site['name']} is DOWN or unreachable! ({site['url']})")
            print(f"Details: {e}")

if __name__ == "__main__":
    print("Starting Website Monitor... Press Ctrl+C to stop.")
    try:
        while True:
            check_status()
            time.sleep(CHECK_INTERVAL)
    except KeyboardInterrupt:
        print("\nMonitoring stopped.")
