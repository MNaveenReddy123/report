// src/components/ColumnFilterPopover.jsx
import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';
import { Filter } from 'lucide-react';

// helper: compute top counts for a field
function topCounts(data = [], field, limit = 8) {
  const counts = new Map();
  for (const r of data) {
    const v = (r && r[field]) ?? null;
    if (v === null || v === undefined) continue;
    const key = String(v);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export default function ColumnFilterPopover({ data = [], field }) {
  const { addFilter, filters, setFilters } = useStore();
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const top = topCounts(data, field, 12);

  // debug hook reserved (not logging by default)
  useEffect(() => {
    // keep available for quick debug if needed
    // if (open) console.log(`[ColumnFilterPopover] field=${field} topValues=`, top);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function openAtButton() {
    if (!btnRef.current) return setOpen(true);
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
      width: rect.width
    });
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  // merges value into an existing include filter or creates a new one
  function addValueAsFilter(value) {
    const idx = filters.findIndex(f => f.field === field && f.mode === 'include');
    if (idx !== -1) {
      const existing = filters[idx];
      if (!existing.values.includes(value)) {
        const nextFilters = [...filters];
        nextFilters[idx] = { ...existing, values: [...existing.values, value] };
        setFilters(nextFilters);
      }
    } else {
      addFilter({ field, mode: 'include', values: [value] });
    }
    close();
  }

  // fallback: allow manual entry when no top values exist
  function addManual() {
    const val = prompt(`Add value to filter for ${field}`);
    if (!val) return;
    addValueAsFilter(val.trim());
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation();
          openAtButton();
        }}
        className="text-gray-400 hover:text-gray-600 p-1"
        aria-label={`Filter ${field}`}
        title={`Filter ${field}`}
        type="button"
      >
        <Filter className="w-4 h-4" />
      </button>

      {open && createPortal(
        <div
          onMouseLeave={close}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            minWidth: 220,
            zIndex: 5000,
            boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
            borderRadius: 6,
            background: '#fff',
            border: '1px solid #e6e6e6',
            padding: 8
          }}
          role="dialog"
        >
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Top values</div>

          {top.length === 0 ? (
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
              No top values found on current dataset.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 260, overflow: 'auto' }}>
              {top.map(t => (
                <button
                  key={t.value}
                  onClick={() => addValueAsFilter(t.value)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 8px',
                    borderRadius: 4,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  type="button"
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                    {t.value}
                  </div>
                  <div style={{ color: '#777', marginLeft: 8 }}>{t.count}</div>
                </button>
              ))}
            </div>
          )}

          <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button
              onClick={addManual}
              aria-label="manual"
              style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #ddd', background: '#fff' }}
              type="button"
            >
              Manual
            </button>
            <button
              onClick={close}
              aria-label="close"
              style={{ padding: '6px 8px', borderRadius: 4, border: 'none', background: '#6b46c1', color: '#fff' }}
              type="button"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
