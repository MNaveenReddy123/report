// src/components/MetricsSelector.jsx
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useStore } from "../store/useStore";

const GROUPS = {
  "Ad Metrics": [
    "impressions",
    "dspTimeouts",
    "noBid",
    "respInvalidated",
    "respRejected",
    "respBlocked",
    "respAuctionCandidate",
    "spend",
    "winRate"
  ],
  "Bid Metrics": [
    "bidRequests",
    "bidResponses",
    "uniqueBidRequests",
    "avgBidCpm",
    "avgPaidCpm"
  ]
};

export default function MetricsSelector({ largeView = false, onApply }) {
  const { selectedMetrics, setSelectedMetrics } = useStore();
  const [open, setOpen] = useState(false);
  const [localSelection, setLocalSelection] = useState([...selectedMetrics]);

  // toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // keep localSelection in sync with store changes
  useEffect(() => {
    setLocalSelection(Array.isArray(selectedMetrics) ? [...selectedMetrics] : []);
  }, [selectedMetrics]);

  // auto-hide toast
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 1800);
    return () => clearTimeout(t);
  }, [showToast]);

  function toggle(metric) {
    setLocalSelection((s) => (s.includes(metric) ? s.filter((x) => x !== metric) : [...s, metric]));
  }

  function selectAllGroup(metrics) {
    setLocalSelection((s) => Array.from(new Set([...s, ...metrics])));
  }

  function deselectAllGroup(metrics) {
    setLocalSelection((s) => s.filter((x) => !metrics.includes(x)));
  }

  function showSavedToast(msg = "Changes saved and applied") {
    setToastMessage(msg);
    setShowToast(true);
  }

  // Called when user clicks Save & Apply in modal mode
  function applyAndClose() {
    // 1) Apply selection to the store
    setSelectedMetrics(localSelection);

    // 2) Optionally notify parent synchronously
    if (typeof onApply === "function") {
      try {
        onApply(localSelection);
      } catch (e) {
        console.error("onApply handler failed:", e);
      }
    }

    // 3) Emit a DOM event in case other code wants to react
    try {
      window.dispatchEvent(new CustomEvent("metrics:updated", { detail: { metrics: localSelection } }));
    } catch (e) { /* ignore */ }

    // 4) show toast
    showSavedToast();

    // 5) Then close the modal (after showing toast)
    setOpen(false);
  }

  // Inline apply (used on largeView configure page)
  function applyInline() {
    setSelectedMetrics(localSelection);
    if (typeof onApply === "function") {
      try {
        onApply(localSelection);
      } catch (e) {
        console.error("onApply handler failed:", e);
      }
    }
    try {
      window.dispatchEvent(new CustomEvent("metrics:updated", { detail: { metrics: localSelection } }));
    } catch (e) {}
    // show toast in inline mode too
    showSavedToast();
    // keep panel visible (no close)
  }

  // If largeView -> render an inline panel (not a modal)
  if (largeView) {
    return (
      <div className="relative">
        <div className="border rounded p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Select Metrics</h3>
            <div className="text-sm text-gray-500">Selected: {localSelection.length}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(GROUPS).map(([groupName, metrics]) => (
              <div key={groupName} className="p-2 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{groupName}</div>
                  <div className="text-xs space-x-2">
                    <button className="underline" onClick={() => selectAllGroup(metrics)}>All</button>
                    <button className="underline" onClick={() => deselectAllGroup(metrics)}>None</button>
                  </div>
                </div>
                <div className="space-y-1">
                  {metrics.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={localSelection.includes(m)}
                        onChange={() => toggle(m)}
                        className="h-4 w-4"
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="px-3 py-1 border rounded"
              onClick={() => setLocalSelection(Array.isArray(selectedMetrics) ? [...selectedMetrics] : [])}
            >
              Reset
            </button>
            <button type="button" className="px-3 py-1 bg-brand text-white rounded" onClick={applyInline}>
              Save & Apply
            </button>
          </div>
        </div>

        {/* Toast (inline panel) */}
        {showToast && (
          <div className="fixed right-6 bottom-6 z-50">
            <div className="bg-black/90 text-white px-4 py-2 rounded shadow">
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Modal mode (small button opens dialog)
  return (
    <div className="relative">
      <button
        type="button"
        className="px-3 py-1 border rounded bg-white text-sm"
        onClick={() => {
          setLocalSelection(Array.isArray(selectedMetrics) ? [...selectedMetrics] : []);
          setOpen(true);
        }}
      >
        Select Metrics
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden />
        <div className="fixed inset-0 flex items-start justify-center p-4">
          <Dialog.Panel className="w-[900px] bg-white rounded shadow-lg p-6">
            <Dialog.Title className="font-semibold text-lg">Select Metrics</Dialog.Title>

            <div className="mt-4 grid grid-cols-2 gap-6">
              {Object.entries(GROUPS).map(([groupName, metrics]) => (
                <div key={groupName} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{groupName}</div>
                    <div className="text-sm space-x-2">
                      <button className="text-xs underline" onClick={() => selectAllGroup(metrics)}>
                        Select All
                      </button>
                      <button className="text-xs underline" onClick={() => deselectAllGroup(metrics)}>
                        Deselect
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {metrics.map((m) => (
                      <label key={m} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={localSelection.includes(m)}
                          onChange={() => toggle(m)}
                          className="h-4 w-4"
                        />
                        <div className="text-sm">{m}</div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="px-3 py-1 border rounded" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" className="px-3 py-1 bg-brand text-white rounded" onClick={applyAndClose}>
                Save & Apply
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* toast for modal mode */}
      {showToast && (
        <div className="fixed right-6 bottom-6 z-50">
          <div className="bg-black/90 text-white px-4 py-2 rounded shadow">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
