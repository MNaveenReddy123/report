// src/components/layout/TopBar.jsx
import React from 'react';

export default function TopBar({ totalCount, onTabChange, activeTab, onDownload, onRun }){
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Report</div>
          <div className="text-xl font-semibold">Ad Metrics</div>
        </div>

        <div className="rounded-md overflow-hidden flex border bg-white">
          <button
            onClick={() => onTabChange && onTabChange('report')}
            className={`px-4 py-2 ${activeTab === 'report' ? 'bg-brand text-white' : 'text-gray-700'}`}
          >
            Report
          </button>
          <button
            onClick={() => onTabChange && onTabChange('configure')}
            className={`px-4 py-2 ${activeTab === 'configure' ? 'bg-brand text-white' : 'text-gray-700'}`}
          >
            Configure
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600"><strong>{totalCount}</strong> Total</div>
        <div className="relative">
          <button
            className="px-3 py-1 border rounded bg-white text-sm"
            onClick={() => onDownload && onDownload()}
          >
            Download CSV
          </button>
        </div>
        <button
          className="px-3 py-1 bg-brand text-white rounded text-sm"
          onClick={() => onRun && onRun()}
        >
          Run as New Report
        </button>
      </div>
    </div>
  );
}
