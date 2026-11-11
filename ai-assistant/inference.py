import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain.chains import RetrievalQA
from langchain.schema import Document

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    groq_api_key=os.environ.get("GROQ_API_KEY"),
    temperature=0.2,
    max_tokens=1024
)

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

vector_store = None

def load_documents(texts: list[str], metadatas: list[dict] = None):
    global vector_store
    docs = [Document(page_content=t, metadata=metadatas[i] if metadatas else {}) for i, t in enumerate(texts)]
    chunks = text_splitter.split_documents(docs)
    if vector_store is None:
        vector_store = FAISS.from_documents(chunks, embeddings)
    else:
        vector_store.add_documents(chunks)

def answer_question(question: str) -> dict:
    if vector_store is None:
        return {"answer": "No documents have been uploaded yet.", "sources": []}
    
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    result = qa_chain.invoke({"query": question})
    
    sources = list(set([
        doc.metadata.get("filename", "unknown")
        for doc in result["source_documents"]
    ]))
    
    return {
        "answer": result["result"],
        "sources": sources
    }

def clear_vector_store():
    global vector_store
    vector_store = None
