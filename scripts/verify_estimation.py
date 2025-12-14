import sys
import os
from unittest.mock import MagicMock

# Add src to path
sys.path.append(os.path.join(os.getcwd(), 'src'))

from services.estimation_service import EstimationService

def test_estimation_tiers():
    service = EstimationService()
    print("🧪 Verifying Estimation Engine Tiers...\n")

    # Mock Project - Standard
    mock_project_std = MagicMock()
    mock_project_std.id = 1
    mock_project_std.area = 100.0
    mock_project_std.property_type = "apartment"
    mock_project_std.client.segment = "commercial"

    # Mock Design - Standard
    mock_design_std = MagicMock()
    mock_design_std.style = "Minimalist"

    result_std = service.calculate_estimation(mock_project_std, mock_design_std)
    print(f"📋 Standard Tier (100sqm): {result_std['total_cost']:,.2f} AED")
    print(f"   - Flooring: {result_std['flooring_cost']:,.2f} AED")
    print(f"   - Tier Used: {result_std.get('tier')}")

    # Mock Project - Luxury
    mock_project_lux = MagicMock()
    mock_project_lux.id = 2
    mock_project_lux.area = 100.0
    mock_project_lux.property_type = "villa"
    mock_project_lux.client.segment = "luxury"

    # Mock Design - Luxury
    mock_design_lux = MagicMock()
    mock_design_lux.style = "Royal Luxury"

    result_lux = service.calculate_estimation(mock_project_lux, mock_design_lux)
    print(f"\n📋 Luxury Tier (100sqm): {result_lux['total_cost']:,.2f} AED")
    print(f"   - Flooring: {result_lux['flooring_cost']:,.2f} AED")
    print(f"   - Tier Used: {result_lux.get('tier')}")

    # Validation
    if result_lux['total_cost'] > result_std['total_cost'] * 1.5:
        print("\n✅ Verification Passed: Luxury tier is significantly more expensive.")
    else:
        print("\n❌ Verification Failed: Cost difference not significant.")

    if result_std['tier'] == 'standard' and result_lux['tier'] == 'luxury':
        print("✅ Tier detection working correctly.")
    else:
        print(f"❌ Tier detection failed. Std: {result_std.get('tier')}, Lux: {result_lux.get('tier')}")

if __name__ == "__main__":
    test_estimation_tiers()
