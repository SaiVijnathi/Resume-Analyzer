'use client';

import { useState } from 'react';

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [resData, setResData] = useState<{ result: any } | null>(null);
  const [summary, setSummary] = useState<{ result: any } | null>(null);
  const [loading, setLoading] = useState<'analyze' | 'summary' | null>(null);
  const [activeButton, setActiveButton] = useState<'analyze' | 'summary' | null>(null);

  const uploadFile = async (endpoint: string, setter: (data: any) => void) => {
    if (!resume) return;

    setLoading(endpoint === '/upload_resume' ? 'analyze' : 'summary');

    const formData = new FormData();
    formData.append('file', resume);

    const result = await fetch(`https://resume-analyzer-k6ee.onrender.com${endpoint}`, {
      method: 'POST',
      body: formData,
    });

    const data = await result.json();
    setter(data);
    setLoading(null);
  };

  const baseBtn =
    'rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-md';

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Resume Analyzer</h1>
          <p className="mt-3 text-base text-slate-600">
            Upload your resume, analyze strengths, missing skills, and generate a summary.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Resume</label>

              <input
                type="file"
                accept=".docx,.pdf"
                onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:cursor-pointer"
              />

              {resume && (
                <p className="mt-2 text-sm text-slate-500">Selected: {resume.name}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveButton('analyze');
                  uploadFile('/upload_resume', setResData);
                }}
                disabled={!resume || loading !== null}
                className={`${baseBtn} ${
                  activeButton === 'analyze'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {loading === 'analyze' ? 'Analyzing...' : 'Analyze Resume'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveButton('summary');
                  uploadFile('/summarize', setSummary);
                }}
                disabled={!resume || loading !== null}
                className={`${baseBtn} ${
                  activeButton === 'summary'
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {loading === 'summary' ? 'Summarizing...' : 'Summarize'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Analysis</h2>

            {resData ? (
              <div className="space-y-4 text-sm text-slate-700">
                <div>
                  <p className="font-medium text-slate-900">Score</p>
                  <p>{resData?.result.score}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-900">Strengths</p>
                  <p>{resData?.result.strengths}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-900">Missing Skills</p>
                  <p>{resData?.result.missing_skills}</p>
                </div>

                <div>
                  <p className="font-medium text-slate-900">Suggestions</p>
                  <p>{resData?.result.suggestions}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No analysis yet.</p>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Summary</h2>

            {summary ? (
              <div className="space-y-3 text-sm text-slate-700">
                <h3 className="text-base font-semibold text-slate-900">{summary?.result.title}</h3>
                <p>{summary?.result.summary}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No summary yet.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}