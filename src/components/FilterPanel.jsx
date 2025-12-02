// src/components/FilterPanel.jsx
import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const DIMENSIONS = ['visitorCountry','deviceOS','size','siteId','appBundle'];

export default function FilterPanel({ compact = false }){
  const { filters, addFilter, removeFilterIndex, setFilters } = useStore();
  const [selDim, setSelDim] = useState('visitorCountry');
  const [mode, setMode] = useState('include');
  const [valueInput, setValueInput] = useState('');

  function add(){
    if (!valueInput) return;
    addFilter({ field: selDim, mode, values: valueInput.split(',').map(s=>s.trim()).filter(Boolean) });
    setValueInput('');
  }

  function clearAll(){
    setFilters([]);
  }

  return (
    <div className={`border rounded p-4 bg-white ${compact ? '' : ''}`}>
      <div className="flex items-center gap-3">
        <select value={selDim} aria-label='dimensions' onChange={(e)=>setSelDim(e.target.value)} className="border rounded px-2 py-1">
          {DIMENSIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={mode} aria-label="includeOrExclude" onChange={(e)=>setMode(e.target.value)} className="border rounded px-2 py-1">
          <option value="include">Include</option>
          <option value="exclude">Exclude</option>
        </select>

        <input placeholder="value1, value2" value={valueInput} onChange={(e)=>setValueInput(e.target.value)} className="border rounded px-2 py-1 flex-1" />

        <button onClick={add} aria-label='add-filter' className="px-3 py-1 bg-brand text-white rounded">Add Filter</button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Active Filters</div>
          <button className="text-sm text-blue-600" aria-label="clear-all" onClick={clearAll}>Clear All</button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {filters.length === 0 && <div className="text-sm text-gray-500">No filters</div>}
          {filters.map((f, idx) => (
            <div key={idx} className="bg-white border rounded px-3 py-2 flex items-center gap-3">
              <div className="text-xs text-gray-500">{f.field}</div>
              <div className="text-xs text-gray-700">{f.mode}</div>
              <div className="flex gap-1">
                {f.values.map(v => <div key={v} className="inline-flex items-center bg-gray-100 rounded px-2 text-xs">{v}</div>)}
              </div>
              <button className="text-red-500 ml-2" aria-label="remove" onClick={() => removeFilterIndex(idx)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
