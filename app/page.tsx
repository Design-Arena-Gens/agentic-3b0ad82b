"use client";
import { useState } from 'react';
import type { PlanNode, PlanOptions } from '@/lib/plan';
import { Tree } from '@/components/Tree';

export default function Page() {
  const [idea, setIdea] = useState('Build an LLM-powered agent platform that turns vague ideas into execution with specialized departments and atomic tasks for 7-8B models.');
  const [breadth, setBreadth] = useState(3);
  const [depth, setDepth] = useState(5);
  const [departmentsCount, setDepartmentsCount] = useState(6);
  const [includeQA, setIncludeQA] = useState(true);
  const [atomicTargetMins, setAtomicTargetMins] = useState(25);
  const [loading, setLoading] = useState(false);
  const [root, setRoot] = useState<PlanNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const options: PlanOptions = { breadth, depth, includeQA, departmentsCount, atomicTargetMins } as any;
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, options }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to generate');
      setRoot(json.plan as PlanNode);
    } catch (e: any) {
      setError(e?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  function downloadJSON() {
    if (!root) return;
    const blob = new Blob([JSON.stringify(root, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agentic-plan.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyJSON() {
    if (!root) return;
    await navigator.clipboard.writeText(JSON.stringify(root, null, 2));
  }

  return (
    <div className="container">
      <div className="card">
        <div className="h1">Agentic Hierarchy Planner</div>
        <div className="muted">Turn a basic idea into a company-like agent hierarchy with departments, programs, and atomic tasks designed for 7-8B models.</div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <div className="card">
          <div style={{ display: 'grid', gap: 12 }}>
            <label>
              <div><strong>Idea</strong></div>
              <textarea className="textarea" value={idea} onChange={(e) => setIdea(e.target.value)} />
            </label>

            <div className="kv">
              <div><strong>Departments</strong></div>
              <input className="input" type="number" min={3} max={10} value={departmentsCount} onChange={(e) => setDepartmentsCount(parseInt(e.target.value || '6', 10))} />

              <div><strong>Depth</strong></div>
              <input className="input" type="number" min={4} max={6} value={depth} onChange={(e) => setDepth(parseInt(e.target.value || '5', 10))} />

              <div><strong>Breadth</strong></div>
              <input className="input" type="number" min={2} max={4} value={breadth} onChange={(e) => setBreadth(parseInt(e.target.value || '3', 10))} />

              <div><strong>Atomic mins</strong></div>
              <input className="input" type="number" min={10} max={60} value={atomicTargetMins} onChange={(e) => setAtomicTargetMins(parseInt(e.target.value || '25', 10))} />

              <div><strong>Include QA</strong></div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={includeQA} onChange={(e) => setIncludeQA(e.target.checked)} /> Enable
              </label>
            </div>

            <div className="toolbar">
              <button className="button" onClick={generate} disabled={loading}>
                {loading ? 'Generating?' : 'Generate Plan'}
              </button>
              <button className="button secondary" onClick={downloadJSON} disabled={!root}>Download JSON</button>
              <button className="button secondary" onClick={copyJSON} disabled={!root}>Copy JSON</button>
            </div>

            {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          </div>
        </div>

        <div className="card">
          {!root ? (
            <div className="muted">Generate a plan to see the hierarchical breakdown here.</div>
          ) : (
            <Tree root={root} />
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="small muted">
        Tip: Tune breadth/depth to control granularity. Atomic tasks target 7-8B models.
      </div>
    </div>
  );
}
