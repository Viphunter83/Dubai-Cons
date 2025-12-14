from typing import Dict, Any
import os
from ai_modules.rag_engine import RAGEngine

# Path to the regulations file
REGULATIONS_PATH = os.path.join(os.getcwd(), 'docs', 'regulations', 'dubai_building_code_summary.txt')

class ComplianceService:
    def __init__(self):
        self._rag_engine = None

    def _get_rag_engine(self):
        """Lazy load RAG engine"""
        if not self._rag_engine:
            print("⏳ Lazy loading RAG Engine...")
            self._rag_engine = RAGEngine(docs_path=REGULATIONS_PATH)
        return self._rag_engine

    def check_design_compliance(self, design_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Checks the given design data against Dubai building regulations.
        """
        project_details = design_data.get('project_details', '')
        client_preferences = design_data.get('client_preferences', '')
        
        # Combine into a description for the RAG query
        description = f"Project: {project_details}. Preferences: {client_preferences}"
        
        if not description.strip():
            return {"status": "skipped", "reason": "No project details provided"}

        # Perform the check using lazy-loaded engine
        rag = self._get_rag_engine()
        compliance_result = rag.check_compliance(description)
        
        return compliance_result

# Singleton instance
compliance_service = ComplianceService()
