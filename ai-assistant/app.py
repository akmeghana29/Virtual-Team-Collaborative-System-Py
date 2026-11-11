import os
import io
import pdfplumber
import docx
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from inference import load_documents, answer_question, clear_vector_store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str

def extract_text(file: UploadFile, contents: bytes) -> str:
    filename = file.filename.lower()
    
    if filename.endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages)
    
    elif filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(contents))
        return "\n".join(para.text for para in doc.paragraphs)
    
    elif filename.endswith(".txt"):
        return contents.decode("utf-8")
    
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF, DOCX, or TXT.")

@app.get("/")
def health():
    return {"status": "running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    text = extract_text(file, contents)
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from file.")
    
    load_documents([text], [{"filename": file.filename}])
    
    return {"message": f"{file.filename} uploaded and indexed successfully."}

@app.post("/ask")
def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    result = answer_question(request.question)
    return result

@app.delete("/clear")
def clear_documents():
    clear_vector_store()
    return {"message": "Vector store cleared successfully."}
