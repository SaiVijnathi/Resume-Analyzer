from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
from docx import Document
from pypdf import PdfReader
import os
import io

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return "hello"


@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    filename = (file.filename or "").lower()

    if filename.endswith(".docx"):
        doc = Document(io.BytesIO(contents))
        resume_text = "\n".join([para.text for para in doc.paragraphs])

    elif filename.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(contents))
        resume_text = "\n".join(
            [page.extract_text() or "" for page in reader.pages]
        )

    else:
        return {"error": "Only .docx and .pdf files are supported"}

    prompt = f"""
    You are a professional resume reviewer.

    Analyze the following resume and provide:
    1. A score out of 100
    2. Detailed feedback on strengths and weaknesses
    3. Suggestions for improvements

    Resume:
    {resume_text}

    Respond in JSON.
    """

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        return {"result": response.text}

    except Exception as e:
        return {"error": str(e)}