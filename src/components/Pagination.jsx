// src/components/Pagination.jsx
import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';

export default function Pagination({ total }) {
  const { page, setPage, pageSize, setPageSize } = useStore();

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  // go to a specific 1-based page (clamped)
  function goTo(p) {
    const clamped = Math.min(Math.max(1, Number(p)), totalPages);
    setPage(clamped);
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-gray-600">
        Showing <strong>{pageSize}</strong> per page
      </div>

      <div className="flex items-center gap-3">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Prev
        </button>

        <div className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={page}
            onChange={(e) => {
              const v = e.target.value === '' ? '' : Number(e.target.value);
              if (v === '') return;
              goTo(v);
            }}
            className="w-16 px-2 py-1 border rounded text-center"
            aria-label="Current page"
          />
          <span>of <strong>{totalPages}</strong></span>
        </div>

        <button
          className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Next
        </button>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
          aria-label="Rows per page"
        >
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>
    </div>
  );
}
