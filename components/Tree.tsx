"use client";
import { useState } from 'react';
import type { PlanNode } from '@/lib/plan';

function Chevron({ open }: { open: boolean }) {
  return (
    <span aria-hidden style={{ display: 'inline-block', transition: 'transform 120ms', transform: `rotate(${open ? 90 : 0}deg)` }}>
      ?
    </span>
  );
}

function NodeRow({ node, depth }: { node: PlanNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className="node" style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {hasChildren ? (
          <button className="button secondary" style={{ padding: '2px 8px' }} onClick={() => setOpen((o) => !o)} aria-label={open ? 'Collapse' : 'Expand'}>
            <Chevron open={open} />
          </button>
        ) : (
          <span style={{ width: 28 }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <strong>{node.title}</strong>
            <span className="badge">{node.type}</span>
            <span className="tag">{node.role}</span>
            {node.effort ? <span className="badge">Effort: {node.effort}</span> : null}
            {node.modelTarget ? <span className="badge">Model: {node.modelTarget}</span> : null}
          </div>
          <div className="small" style={{ marginTop: 4 }}>{node.description}</div>
          {node.acceptanceCriteria && node.acceptanceCriteria.length > 0 && (
            <ul className="small" style={{ margin: '6px 0 0 0', paddingLeft: 18 }}>
              {node.acceptanceCriteria.map((c, i) => (
                <li key={i}>- {c}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {hasChildren && open && (
        <div style={{ marginLeft: 12 }}>
          {node.children.map((c) => (
            <NodeRow key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Tree({ root }: { root: PlanNode }) {
  return (
    <div className="tree">
      <NodeRow node={root} depth={0} />
    </div>
  );
}
