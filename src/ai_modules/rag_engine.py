import os
from typing import List
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.schema import Document

class RAGEngine:
    def __init__(self, docs_path: str):
        self.docs_path = docs_path
        self.db = None
        self._initialize_db()

    def _initialize_db(self):
        """Loads documents and creates a local vector store."""
        print(f"🔄 Initializing RAG Engine with docs from: {self.docs_path}")
        if not os.path.exists(self.docs_path):
            print(f"⚠️ Warning: Docs path {self.docs_path} does not exist.")
            return

        # Load documents
        try:
            loader = TextLoader(self.docs_path)
            documents = loader.load()
            
            # Split text
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
            docs = text_splitter.split_documents(documents)
            
            # Create embeddings
            # encryption=False avoids issues with some environments setup
            embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
            
            # Create vector store
            self.db = FAISS.from_documents(docs, embeddings)
            print("✅ RAG Engine initialized successfully.")
            
        except Exception as e:
            print(f"❌ Error initializing RAG Engine: {e}")

    def query(self, query_text: str, k: int = 3) -> List[Document]:
        """Search the vector database for relevant documents."""
        if not self.db:
            print("⚠️ RAG DB not initialized.")
            return []
            
        try:
            results = self.db.similarity_search(query_text, k=k)
            return results
        except Exception as e:
            print(f"❌ Error querying RAG Engine: {e}")
            return []

    def check_compliance(self, design_description: str) -> dict:
        """
        Simple heuristic compliance check. 
        In a real app, this would use an LLM to compare the retrieved docs 
        with the description. Here we simulate it.
        """
        relevant_docs = self.query(design_description)
        context = "\n".join([doc.page_content for doc in relevant_docs])
        
        # In a real scenario, you'd pass 'context' and 'design_description' to an LLM
        # to ask "Does this design violate any rules?"
        
        # For this MVP, we return the relevant rules so the user (or frontend) can see them.
        return {
            "is_compliant": "Unknown (Manual Verification Needed)",
            "relevant_regulations": context,
            "checked_against": design_description
        }
