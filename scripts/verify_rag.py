import sys
import os

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from services.compliance_service import compliance_service

def test_compliance():
    print("🔍 Testing RAG Compliance Service...")
    
    # Test Case 1: Compliant request
    design_input = {
        "project_details": "G+1 Villa in Palm Jumeirah with 3.5m ceiling height",
        "client_preferences": "Modern style with pitched roof"
    }
    
    print(f"\n📝 Analyzing Design: {design_input['project_details']}")
    result = compliance_service.check_design_compliance(design_input)
    
    print("\n✅ Compliance Report Generated:")
    print(f"Relevant Regulations: \n{result['relevant_regulations'][:500]}...") # Print first 500 chars

    # Test Case 2: Non-compliant (low ceiling)
    design_input_2 = {
        "project_details": "Small service room with 2.0m ceiling",
        "client_preferences": "Cost effective"
    }
    print(f"\n📝 Analyzing Design 2: {design_input_2['project_details']}")
    result_2 = compliance_service.check_design_compliance(design_input_2)
    print(f"Relevant Regulations found: {len(result_2['relevant_regulations']) > 0}")

if __name__ == "__main__":
    test_compliance()
