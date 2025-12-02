// src/components/DataTable/TableHeader.jsx
import React from "react";
import ColumnFilterPopover from "../ColumnFilterPopover";
import { ArrowUp01, ArrowDown01, ArrowUpDown } from "lucide-react";

export default function TableHeader({ header, table, fullData }) {
  const title = header.columnDef?.header ?? header.header ?? header.id;
  const canSort = header.getCanSort ? header.getCanSort() : false;
  const sorted = header.getIsSorted ? header.getIsSorted() : false;

  const dataForFilter =
    typeof fullData !== "undefined" && Array.isArray(fullData)
      ? fullData
      : table && table.options
      ? table.options.data
      : [];

  // fixed icon area width (in px) - keep in sync with CSS .header-icons width
  const ICON_AREA_PX = 56;

  return (
    <div className="relative min-w-[120px]"> {/* make container relative for absolute icons */}
      {/* Title: single-line, reserve right padding equal to icon area */}
      <div className=""> 
        <div  
          className="header-title-singleline text-xs text-left"
          title={title}
          style={{ lineHeight: '1.2rem' }}
        >
          <span className="block">{title}</span>
        </div>
      </div>

      {/* Icons: absolutely positioned to the right so they never overlap title */}
      <div
        className="header-icons flex items-center gap-[2px]"
        style={{
          position: 'absolute',
          right: 1,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'auto'
        }}
        aria-hidden={false}
      >
        {canSort ? (
          <button
            onClick={() => header.toggleSorting(sorted === "asc")}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label={`Sort ${title}`}
            type="button"
          >
            {sorted === "asc" ? (
              <ArrowUp01 className="w-4 h-4" />
            ) : sorted === "desc" ? (
              <ArrowDown01 className="w-4 h-4" />
            ) : (
              <ArrowUpDown className="w-4 h-4" />
            )}
          </button>
        ) : null}
        <ColumnFilterPopover data={dataForFilter} field={header.id} />
      </div>
    </div>
  );
}

