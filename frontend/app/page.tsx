'use client';

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);

  const [resData, setResData] = useState<{ result: string } | null>(null);

  const sendResume = async () => {
    if(!resume) return

    const formData = new FormData();
    formData.append("file", resume);

    const reqOptions = {
      method : "POST",
      body : formData
    }

    const result = await fetch("http://127.0.0.1:8000/upload_resume", reqOptions);
    const data = await result.json();
    setResData(data)
    console.log(data)
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
      </form>

      <div>
        <div>{resData?.result}</div>
      </div>

    </div>
  );
}
