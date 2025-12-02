// src/components/DataTable/DataTable.jsx

import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useStore } from '../../store/useStore';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { fmtNumber, fmtCurrency } from '../../utils/formatters';

const columnHelper = createColumnHelper();

// Measure text width via canvas (same helper)
function measureTextWidth(
  text,
  font = '14px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
) {
  try {
    const ctx =
      measureTextWidth._ctx ||
      (measureTextWidth._ctx = document.createElement('canvas').getContext('2d'));
    ctx.font = font;
    return ctx.measureText(String(text)).width;
  } catch (e) {
    return Math.min(400, String(text).length * 8);
  }
}

export default function DataTable({ data, fullData = [] }) {
  const { selectedMetrics } = useStore();
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(56);

  // -------- Columns --------
  const columns = useMemo(() => {
    const dims = [
      columnHelper.accessor('appBundle', { header: 'App Bundle', meta: { type: 'text', minWidth: 220 } }),
      columnHelper.accessor('siteId', { header: 'Site ID', meta: { type: 'number', minWidth: 120 } }),
      columnHelper.accessor('deviceOS', { header: 'Device OS', meta: { type: 'text', minWidth: 120 } }),
      columnHelper.accessor('visitorCountry', { header: 'Visitor Country', meta: { type: 'text', minWidth: 160 } }),
      columnHelper.accessor('size', { header: 'Size', meta: { type: 'text', minWidth: 120 } }),
    ];

    const metrics = selectedMetrics.map(m =>
      columnHelper.accessor(m, {
        id: m,
        header: m,
        meta: { type: m === 'spend' ? 'currency' : 'number', minWidth: 120 },
        cell: info => {
          const v = info.getValue();
          if (m === 'spend') return fmtCurrency(v);
          return fmtNumber(v);
        }
      })
    );

    return [...dims, ...metrics];
  }, [selectedMetrics]);

  // -------- Table instance --------
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  // -------- Column width calculation --------
  const gridTemplate = useMemo(() => {
    const cols = table.getAllLeafColumns();
    return cols
      .map((col) => {
        const headerText = (col.columnDef && (col.columnDef.header || col.id)) || col.id;
        const baseMin = (col.columnDef && col.columnDef.meta && col.columnDef.meta.minWidth) || 120;
        const measured = Math.ceil(measureTextWidth(headerText, '14px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'));
        const desired = Math.max(baseMin, measured + 72); // extra space for icons
        return `minmax(${desired}px, max-content)`;
      })
      .join(' ');
  }, [table, selectedMetrics, data.length]);

useLayoutEffect(() => {
  if (!headerRef.current) return setHeaderHeight(56);

  const measure = () => {
    if (!headerRef.current) return;
    const r = headerRef.current.getBoundingClientRect();
    setHeaderHeight(Math.ceil(r.height)+4);
  };
  measure();
  

  // ResizeObserver to detect height changes
  const ro = new ResizeObserver(() => measure());
  ro.observe(headerRef.current);

  // measure on window resize
  const onWindowResize = () => measure();
  window.addEventListener('resize', onWindowResize);

  // measure on scroll of the table container (horizontal + vertical)
  const sc = containerRef.current;
  const onContainerScroll = () => measure();
  if (sc && sc.addEventListener) {
    sc.addEventListener('scroll', onContainerScroll, { passive: true });
  }

  return () => {
    ro.disconnect();
    window.removeEventListener('resize', onWindowResize);
    if (sc && sc.removeEventListener) {
      sc.removeEventListener('scroll', onContainerScroll);
    }
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [gridTemplate, table.getAllLeafColumns().length]);


  // -------- Virtual rows --------
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 56,
    overscan: 6
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  // -------- Render --------
  return (
    <div className="border rounded bg-white">
      <div
        ref={containerRef}
        style={{
          height: 520,
          overflow: 'auto',
          position: 'relative'
        }}
        className="w-full"
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: gridTemplate
          }}
          className="table-header px-4 py-3 gap-0"
        >
          {table.getAllLeafColumns().map((col) => (
            <div key={col.id} className="px-4 py-2">
              <TableHeader header={col} table={table} fullData={fullData} />
            </div>
          ))}
        </div>

        {/* Body + virtual rows */}
        <div
          style={{
            height: totalSize + headerHeight,
            position: 'relative',
            paddingTop: headerHeight
          }}
        >
          {virtualRows.map((vRow) => {
            const row = table.getRowModel().rows[vRow.index];
            return (
              <div
                key={row.id}
                style={{
                  position: 'absolute',
                  top: vRow.start,
                  left: 0,
                  right: 0
                }}
              >
                <TableRow row={row} gridTemplate={gridTemplate} />
              </div>
            );
          })}

          {table.getRowModel().rows.length === 0 && (
            <div className="p-6 text-center text-gray-500">No rows</div>
          )}
        </div>
      </div>
    </div>
  );
}
