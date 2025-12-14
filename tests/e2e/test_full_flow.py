import pytest
from fastapi.testclient import TestClient

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_create_project_and_generate_design(client):
    # 1. Create Client
    client_data = {
        "name": "Test Client E2E",
        "email": "test@example.com",
        "company": "E2E Corp"
    }
    # Note: If email violates unique constraint (already exists), this might fail.
    # In a real test, use unique email or clean up.
    # For now, let's try to create, if fails assume it exists or ignore for MVP flow 
    # (actually better to POST to a generic 'create or get' logic if we had it, but standard is fail)
    # We'll use a random email
    import random
    email = f"test_{random.randint(1000,9999)}@example.com"
    client_data["email"] = email
    
    r_client = client.post("/api/v1/clients/", json=client_data)
    assert r_client.status_code in [200, 201]  # 201 created usually
    client_id = r_client.json()["id"]

    # 2. Create Project
    project_data = {
        "name": "Test Project E2E",
        "client_id": client_id,
        "description": "A nice villa test"
    }
    r_project = client.post("/api/v1/projects/", json=project_data)
    assert r_project.status_code == 201
    project_id = r_project.json()["id"]

    # 3. Generate Design
    # Using mock mode (assuming API key might be missing or we want speed)
    design_req = {
        "client_preferences": "Modern, White",
        "project_details": "Villa in Palm Jumeirah",
        "use_pro_for_image": False
    }
    r_design = client.post("/api/v1/design/generate", json=design_req)
    # This might take a few seconds
    assert r_design.status_code == 200
    design_result = r_design.json()
    
    assert "description" in design_result
    assert "image_url" in design_result
    # Check if rooms generated (if LLM worked)
    # assert "rooms_designs" in design_result 

    # 4. Generate Report
    report_req = {
        "project_details": {"project_details": "Villa in Palm Jumeirah"},
        "design_result": design_result
    }
    r_report = client.post("/api/v1/reports/generate", json=report_req)
    assert r_report.status_code == 200
    assert r_report.headers["content-type"] == "application/pdf"
    assert len(r_report.content) > 1000 # Should be a valid PDF size
