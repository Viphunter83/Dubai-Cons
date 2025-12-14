"""
Simple test script for Dubai Cons AI Suite MVP API
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"


def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")


def test_create_client():
    """Test creating a client"""
    print("👤 Testing client creation...")
    client_data = {
        "name": "Ahmed Al Maktoum",
        "email": "ahmed@example.com",
        "phone": "+971501234567",
        "segment": "luxury",
        "budget_range": "500k-1M AED",
        "preferences": "Modern luxury with marble and gold accents"
    }
    response = requests.post(f"{BASE_URL}/api/v1/clients/", json=client_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        client = response.json()
        print(f"Created client: {client['name']} (ID: {client['id']})")
        return client['id']
    print(f"Response: {response.text}\n")
    return None


def test_create_project(client_id=None):
    """Test creating a project"""
    print("🏗️  Testing project creation...")
    project_data = {
        "title": "Luxury Villa Interior - Palm Jumeirah",
        "description": "Modern luxury villa design for Dubai",
        "property_type": "villa",
        "area": 500.0,
        "location": "Palm Jumeirah, Dubai",
        "budget": 500000.0,
        "client_id": client_id
    }
    response = requests.post(f"{BASE_URL}/api/v1/projects/", json=project_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        project = response.json()
        print(f"Created project: {project['title']} (ID: {project['id']})")
        return project['id']
    print(f"Response: {response.text}\n")
    return None


def test_generate_design(project_id=None):
    """Test design generation (requires AI API)"""
    print("🎨 Testing design generation...")
    design_request = {
        "client_preferences": "Luxury modern style, prefer marble and gold accents, open space design, smart home integration",
        "project_details": "500 sqm villa in Palm Jumeirah, 4 bedrooms, 3 bathrooms, living area, kitchen, dining",
        "project_id": project_id
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/design/generate",
            json=design_request,
            timeout=120
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            concept = response.json()
            print(f"Generated design concept (ID: {concept['id']})")
            print(f"Style: {concept['style']}")
            print(f"Color Scheme: {concept['color_scheme']}")
            return concept['id']
        else:
            print(f"Error: {response.text}")
    except requests.exceptions.Timeout:
        print("⏱️  Request timed out (AI generation takes time)")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None


def main():
    print("=" * 60)
    print("🧪 Dubai Cons AI Suite MVP - API Test Suite")
    print("=" * 60 + "\n")
    
    # Test 1: Health check
    test_health()
    
    # Test 2: Create client
    client_id = test_create_client()
    print()
    
    # Test 3: Create project
    project_id = test_create_project(client_id)
    print()
    
    # Test 4: Generate design (optional - requires ProxyAPI)
    print("💡 Design generation requires ProxyAPI key configured")
    print("   Skipping AI generation test...\n")
    # Uncomment to test (requires valid API key):
    # design_id = test_generate_design(project_id)
    
    print("=" * 60)
    print("✅ Tests completed!")
    print("=" * 60)
    
    if client_id and project_id:
        print(f"\n📊 Created:")
        print(f"   Client ID: {client_id}")
        print(f"   Project ID: {project_id}")
        print(f"\n🔗 View in database: sqlite3 storage/dubai_cons.db")
        print(f"🌐 API Docs: http://localhost:8000/docs")


if __name__ == "__main__":
    main()
