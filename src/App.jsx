
import React, { useMemo, useEffect, useState } from 'react';
import sampleData from './data/sampleData.json';
import { useStore } from './store/useStore';
import MetricsSelector from './components/MetricsSelector';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable/DataTable';
import Pagination from './components/Pagination';
import TopBar from './components/layout/TopBar';
import './index.css';
import { applyFilters } from './utils/applyFilters';
import { exportToCSV } from './components/ExportCSV';
// import { getHostnameTheme } from './theme';

const themes = {
  default: {
    '--brand': '#5b21b6',
    '--muted': '#6b7280',
    '--background': '#F9FAFB' // gray-50 typical bg
  },
  theme1: {
    '--brand': '#1E90FF', // DodgerBlue
    '--muted': '#4B5563', // Tailwind gray-700
    '--background': '#EFF6FF' // Tailwind blue-50
  },
  theme2: {
    '--brand': '#EF4444', // Red-500
    '--muted': '#6B7280', // Tailwind gray-500
    '--background': '#FEF2F2' // Tailwind red-50
  },
  theme3: {
    '--brand': '#10B981', // Emerald-500
    '--muted': '#374151', // Tailwind gray-800
    '--background': '#ECFDF5' // Tailwind green-50
  }
};

const brandings = {
  default: {
    brandName: "Ad Metrics",
    logoURL: null
  },
  maki: {
    brandName: "Maki Brand 1",
    logoURL: "https://yourlogo1.png"
  },
  maki1: {
    brandName: "Maki Brand 1",
    logoURL: "https://yourlogo1.png"
  },
  maki2: {
    brandName: "Maki Brand 2",
    logoURL: "https://yourlogo2.png"
  },
  brand2: {
    brandName: "Brand 2",
    logoURL: "https://brand2logo.png"
  }
};


function setThemeColors(theme) {
  const root = document.documentElement;
  const themeColors = themes[theme] || themes.default;
  Object.entries(themeColors).forEach(([varName, value]) => {
    root.style.setProperty(varName, value);
  });
}

// Modified to return theme and branding info for hostname
function getHostnameTheme(key) {
  if (key === "maki") return "theme1";
  if (key === "maki2") return "theme2";
  if (key === "brand2") return "theme3";
  return "default";
}


function getBranding(hostname) {
  return brandings[hostname] || brandings["localhost"];
}

export default function App() {
  // store values
  const { filters, setFilters, page, setPage, pageSize } = useStore();

  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'configure'

  // Set theme and branding based on hostname on mount
 useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const brandKey = params.get("brand") || "default";

  const branding = brandings[brandKey] || brandings.default;
  setBranding(branding);

  // Also load theme for this brand
  const theme = getHostnameTheme(brandKey);
  setThemeColors(theme);

}, []);


  // Get branding info based on hostname
  const [branding, setBranding] = React.useState({ brandName: 'Ad Metrics', logoURL: null });

  useEffect(() => {
    const hostname = window.location.hostname;
    const brand = getBranding(hostname);
    setBranding(brand);
  }, []);

  // Later when rendering TopBar, pass branding props

  // Compute filtered dataset (full)
  const filtered = useMemo(() => applyFilters(sampleData, filters), [filters]);

  // Total pages for current filter/pageSize
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Ensure current page is within bounds when filtered/ pageSize changes
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
    // if filters changed often, you may want to reset to page 1 here instead:
    // if (page !== 1) setPage(1);
    // we already reset page in store when filters change (see useStore update)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, setPage]);

  // compute paged slice for the DataTable
  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filtered.slice(start, end);
  }, [filtered, page, pageSize]);

  // Download current filtered rows (all filtered rows)
  function handleDownload() {
    // base columns (dimensions) in the order you render in the table
  const baseCols = [
    { key: 'appBundle', label: 'App Bundle' },
    { key: 'siteId', label: 'Site ID' },
    { key: 'deviceOS', label: 'Device OS' },
    { key: 'visitorCountry', label: 'Visitor Country' },
    { key: 'size', label: 'Size' }
  ];

  // metrics selected in store (order matters)
  const { selectedMetrics } = useStore.getState(); // read directly
  const metricCols = selectedMetrics.map(m => ({ key: m, label: m }));

  const columns = [...baseCols, ...metricCols];

  // filtered should be the full filtered dataset (not paged)
  // exportToCSV(filtered, 'ad-report.csv', columns);
    exportToCSV(filtered, 'ad-report.csv',columns);
  }

  // Run as new report (example: clear filters and reset page)
  function handleRun() {
    setFilters([]); // clear filters and reset page (store handles resetting)
    // optionally reset metrics if you want:
    // useStore.getState().setSelectedMetrics(['impressions','dspTimeouts','noBid','respAuctionCandidate']);
    alert('Filters cleared and report reset (example action).');
  }

  return (
    <div className="min-h-screen p-6" style={{backgroundColor: "var(--background)"}}>
      <div className="max-w-[1300px] mx-auto">
        <TopBar
          totalCount={total}
          onTabChange={setActiveTab}
          activeTab={activeTab}
          onDownload={handleDownload}
          onRun={handleRun}
          brandName={branding?.brandName}
          logoURL={branding?.logoURL}
        />

        <div className="mt-6">
          {activeTab === 'report' ? (
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <FilterPanel />
                  <div className="mt-4">
                    {/* Pass only current page's rows to DataTable */}
                    {/* <DataTable data={pagedData} />
                     */}
                     <DataTable data={pagedData} fullData={filtered} />

                  </div>
                  <div className="mt-4">
                    <Pagination total={total} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Configure page: show metrics selector full and filter builder
            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Configure Report</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <MetricsSelector largeView />
                </div>
                <div>
                  <FilterPanel compact />
                  <div className="mt-4 text-sm text-gray-600">Drag to reorder metrics or filters where applicable.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
