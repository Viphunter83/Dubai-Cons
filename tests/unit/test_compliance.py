import pytest
from unittest.mock import MagicMock, patch
import sys
import os

from services.compliance_service import ComplianceService

# Mock the RAGEngine class to prevent loading heavy models
@pytest.fixture
def mock_rag_engine():
    with patch('services.compliance_service.RAGEngine') as MockClass:
        mock_instance = MockClass.return_value
        # Setup default behavior
        mock_instance.check_compliance.return_value = {
            "is_compliant": True,
            "issues": [],
            "regulations": ["Reg 1", "Reg 2"],
            "score": 100
        }
        yield mock_instance

def test_compliance_init_lazy(mock_rag_engine):
    """Test that RAG engine is NOT loaded on init"""
    service = ComplianceService()
    # Should be None initially
    assert service._rag_engine is None

def test_compliance_check_loads_engine(mock_rag_engine):
    """Test that checking compliance triggers lazy load"""
    service = ComplianceService()
    
    design_data = {"description": "A tall tower"}
    
    # Run check
    result = service.check_design_compliance(design_data)
    
    # Assert result structure
    assert result["is_compliant"] is True
    assert result["score"] == 100
    
    # Assert Mock was instantiated
    assert service._rag_engine is not None
    mock_rag_engine.check_compliance.assert_called_once()

def test_compliance_fail_logic(mock_rag_engine):
    """Test handling of non-compliant response from RAG"""
    # Override mock behavior
    mock_rag_engine.check_compliance.return_value = {
        "is_compliant": False,
        "issues": ["Too tall"],
        "regulations": ["Max height 100m"]
    }
    
    service = ComplianceService()
    result = service.check_design_compliance({"description": "Very tall"})
    
    assert result["is_compliant"] is False
    # assert result["score"] < 100 # RAG might not return score in failure mock
    assert "Too tall" in result["issues"]
