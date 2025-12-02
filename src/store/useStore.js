import { create } from 'zustand';

export const useStore = create((set) => ({
  // selected metrics (default)
  selectedMetrics: ['impressions','dspTimeouts','noBid','respAuctionCandidate'],
  setSelectedMetrics: (m) => set({ selectedMetrics: m }),

  // filters (array of { field, mode: 'include'|'exclude', values: [] })
  filters: [],
  // when setting filters directly, also reset page to 1
  setFilters: (f) => set({ filters: f, page: 1 }),

  // add a filter and reset page to 1
  addFilter: (filter) =>
    set((s) => ({ filters: [...s.filters, filter], page: 1 })),

  // remove filter by index and reset page to 1
  removeFilterIndex: (idx) =>
    set((s) => ({ filters: s.filters.filter((_, i) => i !== idx), page: 1 })),

  // pagination state
  page: 1,
  setPage: (p) => set({ page: p }),

  pageSize: 25,
  // when pageSize changes we also reset page to 1
  setPageSize: (s) => set((state) => ({ pageSize: s, page: 1 }))
}));
