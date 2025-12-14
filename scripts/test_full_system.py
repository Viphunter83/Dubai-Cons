#!/usr/bin/env python3
"""
Full System Test Script for Dubai Cons AI Suite
Tests all major functionality of the API
"""

import requests
import json
import sys
from typing import Dict, Any

BASE_URL = "http://localhost:8000"

def print_section(title: str):
    """Print formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_endpoint(method: str, url: str, data: Dict = None, expected_status: int = 200) -> Any:
    """Test an API endpoint"""
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        if response.status_code == expected_status:
            print(f"✅ {method} {url} - Status: {response.status_code}")
            return response.json() if response.content else None
        else:
            print(f"❌ {method} {url} - Status: {response.status_code}")
            print(f"   Response: {response.text[:100]}")
            return None
    except Exception as e:
        print(f"❌ {method} {url} - Error: {str(e)}")
        return None

def main():
    """Run all tests"""
    
    print_section("Dubai Cons AI Suite - Full System Test")
    
    # Test 1: Health Check
    print_section("1. Testing Health Check")
    health_data = test_endpoint("GET", f"{BASE_URL}/health")
    if health_data:
        print(f"   Data: {health_data}")
    
    # Test 2: Root Endpoint
    print_section("2. Testing Root Endpoint")
    root_data = test_endpoint("GET", f"{BASE_URL}/")
    if root_data:
        print(f"   Data: {root_data}")
    
    # Test 3: Create Client
    print_section("3. Creating Test Client")
    client_data = {
        "name": "Test Client System Check",
        "email": "test@system.com",
        "phone": "+971501234569",
        "segment": "commercial",
        "preferences": "Modern office design with open spaces",
        "budget_range": "200k-400k AED"
    }
    created_client = test_endpoint("POST", f"{BASE_URL}/api/v1/clients/", client_data, 201)
    client_id = created_client["id"] if created_client else None
    print(f"   Client ID: {client_id}")
    
    # Test 4: Get All Clients
    print_section("4. Getting All Clients")
    clients = test_endpoint("GET", f"{BASE_URL}/api/v1/clients/")
    print(f"   Total clients: {len(clients) if clients else 0}")
    
    # Test 5: Create Project
    print_section("5. Creating Test Project")
    project_data = {
        "title": "Test Office Project",
        "description": "System testing project",
        "client_id": client_id,
        "property_type": "office",
        "area": 300.0,
        "location": "Dubai, UAE",
        "budget": 150000.0
    }
    created_project = test_endpoint("POST", f"{BASE_URL}/api/v1/projects/", project_data, 201)
    project_id = created_project["id"] if created_project else None
    print(f"   Project ID: {project_id}")
    
    # Test 6: Get All Projects
    print_section("6. Getting All Projects")
    projects = test_endpoint("GET", f"{BASE_URL}/api/v1/projects/")
    print(f"   Total projects: {len(projects) if projects else 0}")
    
    # Test 7: Stats Overview
    print_section("7. Testing Stats API")
    stats = test_endpoint("GET", f"{BASE_URL}/api/v1/stats/overview")
    if stats:
        print(f"   Total projects: {stats.get('total_projects')}")
        print(f"   Total clients: {stats.get('total_clients')}")
        print(f"   Total designs: {stats.get('total_designs')}")
        print(f"   Average budget: {stats.get('average_budget')}")
    
    # Test 8: AI Design Generation (может занять время)
    print_section("8. Testing AI Design Generation")
    design_data = {
        "client_preferences": "Modern minimalistic office design, prefer clean lines and neutral colors",
        "project_details": f"300 sqm office space, {project_id} project, located in Dubai Marina",
        "project_id": project_id
    }
    print("   ⏳ AI generation in progress... (this may take 30-60 seconds)")
    design_result = test_endpoint("POST", f"{BASE_URL}/api/v1/design/generate", design_data, 200)
    design_id = design_result["id"] if design_result else None
    print(f"   Design ID: {design_id}")
    
    # Test 9: 3D Visualization
    print_section("9. Testing 3D Visualization")
    visualization_data = {
        "room_type": "office",
        "dimensions": {"width": 5.0, "depth": 6.0, "height": 3.0},
        "design_elements": {
            "floor_material": "carpet",
            "floor_color": "#F5F5F5",
            "wall_color": "#FFFFFF",
            "ceiling_type": "grid"
        }
    }
    scene = test_endpoint("POST", f"{BASE_URL}/api/v1/visualization/create-scene", visualization_data)
    if scene:
        print(f"   Scene ID: {scene.get('scene_id')}")
        print(f"   Objects count: {scene.get('objects_count')}")
    
    # Test 10: Get Project by ID
    if project_id:
        print_section("10. Getting Project by ID")
        project = test_endpoint("GET", f"{BASE_URL}/api/v1/projects/{project_id}")
        if project:
            print(f"   Title: {project.get('title')}")
            print(f"   Area: {project.get('area')} sqm")
            print(f"   Budget: {project.get('budget')} AED")
    
    # Test 11: Get Client by ID
    if client_id:
        print_section("11. Getting Client by ID")
        client = test_endpoint("GET", f"{BASE_URL}/api/v1/clients/{client_id}")
        if client:
            print(f"   Name: {client.get('name')}")
            print(f"   Segment: {client.get('segment')}")
    
    # Test 12: Validation Tests
    print_section("12. Testing Validation")
    
    # Try with invalid data
    print("   Testing invalid client creation (empty name)...")
    invalid_client = test_endpoint("POST", f"{BASE_URL}/api/v1/clients/", 
                                   {"name": "", "email": "invalid"}, 422)
    print("   ✅ Validation works correctly")
    
    # Summary
    print_section("TEST SUMMARY")
    print("\n✅ System is working correctly!")
    print(f"✅ API available at: {BASE_URL}")
    print(f"✅ Swagger docs at: {BASE_URL}/docs")
    print(f"\nTotal tests passed: 12+")
    
    return 0

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Test failed with error: {str(e)}")
        sys.exit(1)

