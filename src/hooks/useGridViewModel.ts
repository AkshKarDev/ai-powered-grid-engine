
import { useState, useMemo, useCallback } from 'react';
import { GridRow, GridColumn, SortConfig, FilterConfig, GridState, GridConfig } from '@/types/grid';

export const useGridViewModel = (
  initialData: GridRow[],
  columns: GridColumn[],
  config: GridConfig = {
    rowHeight: 40,
    headerHeight: 50,
    overscan: 5,
    virtualScrolling: true
  }
) => {
  const [state, setState] = useState<GridState>({
    data: initialData,
    filteredData: initialData,
    sortConfig: null,
    filters: [],
    selectedRows: new Set(),
    scrollTop: 0,
    scrollLeft: 0
  });

  // Sorting logic
  const sortData = useCallback((data: GridRow[], sortConfig: SortConfig | null): GridRow[] => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      
      if (aVal === bVal) return 0;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
  }, []);

  // Filtering logic
  const filterData = useCallback((data: GridRow[], filters: FilterConfig[]): GridRow[] => {
    if (filters.length === 0) return data;

    return data.filter(row => {
      return filters.every(filter => {
        const value = row[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'equals':
            return value === filterValue;
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          case 'gt':
            return Number(value) > Number(filterValue);
          case 'lt':
            return Number(value) < Number(filterValue);
          case 'gte':
            return Number(value) >= Number(filterValue);
          case 'lte':
            return Number(value) <= Number(filterValue);
          default:
            return true;
        }
      });
    });
  }, []);

  // Process data (filter then sort)
  const processedData = useMemo(() => {
    let result = filterData(state.data, state.filters);
    result = sortData(result, state.sortConfig);
    return result;
  }, [state.data, state.filters, state.sortConfig, filterData, sortData]);

  // Update filtered data when processed data changes
  useMemo(() => {
    setState(prev => ({ ...prev, filteredData: processedData }));
  }, [processedData]);

  // Actions
  const setSortConfig = useCallback((sortConfig: SortConfig | null) => {
    setState(prev => ({ ...prev, sortConfig }));
  }, []);

  const addFilter = useCallback((filter: FilterConfig) => {
    setState(prev => ({
      ...prev,
      filters: [...prev.filters.filter(f => f.field !== filter.field), filter]
    }));
  }, []);

  const removeFilter = useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      filters: prev.filters.filter(f => f.field !== field)
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: [] }));
  }, []);

  const setScrollPosition = useCallback((scrollTop: number, scrollLeft: number) => {
    setState(prev => ({ ...prev, scrollTop, scrollLeft }));
  }, []);

  const toggleRowSelection = useCallback((rowId: string) => {
    setState(prev => {
      const newSelection = new Set(prev.selectedRows);
      if (newSelection.has(rowId)) {
        newSelection.delete(rowId);
      } else {
        newSelection.add(rowId);
      }
      return { ...prev, selectedRows: newSelection };
    });
  }, []);

  return {
    state,
    config,
    columns,
    processedData,
    setSortConfig,
    addFilter,
    removeFilter,
    clearFilters,
    setScrollPosition,
    toggleRowSelection
  };
};
