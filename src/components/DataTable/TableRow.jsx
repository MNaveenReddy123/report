// src/components/DataTable/TableRow.jsx
import React from 'react';
import { flexRender } from '@tanstack/react-table';

/*
  row: a TanStack row object
  gridTemplate: CSS grid-template-columns string (passed from DataTable)
*/
export default function TableRow({ row, gridTemplate }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center' }}
      className="table-row text-sm gap-0"
      role="row"
    >
      {row.getVisibleCells().map(cell => {
        const meta = cell.column.columnDef.meta || {};
        const isNumber = meta.type === 'number' || meta.type === 'currency';
        const cellClass = `${isNumber ? 'text-right' : 'text-left'} px-4 py-3`;
        const value = cell.getValue();
        return (
          <div
            key={cell.id}
            role="cell"
            className={cellClass}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={value == null ? '' : String(value)}
          >
            {flexRender(cell.column.columnDef.cell ?? cell.column.columnDef.header, cell.getContext())}
          </div>
        );
      })}
    </div>
  );
}
