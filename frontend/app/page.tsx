'use client';

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);

  const [resData, setResData] = useState<{ result: any } | null>(null);

  const [summary, setSummary] = useState<{ result: any } | null>(null);

  const sendResume = async () => {
    if(!resume) return

    const formData = new FormData();
    formData.append("file", resume);

    const reqOptions = {
      method : "POST",
      body : formData
    }

    // const result = await fetch("http://127.0.0.1:8000/upload_resume", reqOptions);
    const result = await fetch("https://resume-analyzer-k6ee.onrender.com/upload_resume", reqOptions);
    const data = await result.json();
    setResData(data)
    console.log(data)
  }

  const summarize = async () => {
    if(!resume) return

    const formData = new FormData();
    formData.append("file", resume);

    const reqOptions = {
      method : "POST",
      body : formData
    }

    // const result = await fetch("http://127.0.0.1:8000/summarize", reqOptions);
    const result = await fetch("https://resume-analyzer-k6ee.onrender.com/summarize", reqOptions);
    const data = await result.json();

    console.log("summary",data)

    setSummary(data)

  }

  return (
    <div>
      <form>
        <div>
          <label>Resume</label>
            <input
              type="file"
              accept=".docx,.pdf"   //restricts file picker to only these types
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            />        
          </div>
        <button type="button" onClick={sendResume}>submit</button>
        <button type="button" onClick={summarize}>Summarize</button>
      </form>

      <div>
        <p>{resData?.result.score}</p>
        <p>{resData?.result.strengths}</p>
        <p>{resData?.result.missing_skills}</p>
        <p>{resData?.result.suggestions}</p>
      </div>
        <hr/>
      <div>
        <h1>{summary?.result.title}</h1>
        <p>{summary?.result.summary}</p>
      </div>
      <hr/>
    </div>
  );
}
