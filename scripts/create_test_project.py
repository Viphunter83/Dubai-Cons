import requests
import json

def create_project():
    url = "http://localhost:8000/api/v1/projects/"
    data = {
        "name": "E2E Test Villa Phoenix",
        "location": "Palm Jumeirah",
        "property_type": "Villa",
        "area": 750,
        "budget": 2500000,
        "description": "Automated E2E Test Project"
    }
    
    try:
        res = requests.post(url, json=data)
        if res.status_code == 200:
            print(f"Created Project ID: {res.json()['id']}")
        else:
            print(f"Failed: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_project()
