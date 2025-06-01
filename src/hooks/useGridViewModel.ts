
import { useState, useMemo, useCallback } from 'react';
import { GridRow, GridColumn, SortConfig, FilterConfig, GridState, GridConfig, GroupConfig, GroupedRow } from '@/types/grid';
import { groupData, toggleGroupExpansion } from '@/utils/gridGrouping';

export const useGridViewModel = (
  initialData: GridRow[],
  initialColumns: GridColumn[],
  config: GridConfig = {
    rowHeight: 40,
    headerHeight: 50,
    groupRowHeight: 44,
    overscan: 5,
    virtualScrolling: true,
    enableGrouping: true,
    enableColumnDragging: true,
    theme: 'default'
  }
) => {
  const [state, setState] = useState<GridState>({
    data: initialData,
    filteredData: initialData,
    processedData: initialData,
    sortConfig: null,
    filters: [],
    groups: [],
    selectedRows: new Set(),
    scrollTop: 0,
    scrollLeft: 0,
    columnOrder: initialColumns.map(col => col.id),
    expandedGroups: new Set()
  });

  // Get ordered columns
  const orderedColumns = useMemo(() => {
    return state.columnOrder
      .map(id => initialColumns.find(col => col.id === id))
      .filter(Boolean) as GridColumn[];
  }, [state.columnOrder, initialColumns]);

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

  // Process data (filter, sort, then group)
  const processedData = useMemo(() => {
    let result = filterData(state.data, state.filters);
    result = sortData(result, state.sortConfig);
    
    if (state.groups.length > 0) {
      return groupData(result, state.groups, state.expandedGroups);
    }
    
    return result;
  }, [state.data, state.filters, state.sortConfig, state.groups, state.expandedGroups, filterData, sortData]);

  // Update processed data when it changes
  useMemo(() => {
    setState(prev => ({ ...prev, processedData }));
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

  const addGroup = useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      groups: [...prev.groups.filter(g => g.field !== field), { field, expanded: true }]
    }));
  }, []);

  const removeGroup = useCallback((field: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.field !== field)
    }));
  }, []);

  const clearGroups = useCallback(() => {
    setState(prev => ({ ...prev, groups: [], expandedGroups: new Set() }));
  }, []);

  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setState(prev => ({
      ...prev,
      expandedGroups: toggleGroupExpansion(prev.expandedGroups, groupKey)
    }));
  }, []);

  const reorderColumns = useCallback((newOrder: string[]) => {
    setState(prev => ({ ...prev, columnOrder: newOrder }));
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
    columns: orderedColumns,
    processedData,
    setSortConfig,
    addFilter,
    removeFilter,
    clearFilters,
    addGroup,
    removeGroup,
    clearGroups,
    toggleGroupExpansion,
    reorderColumns,
    setScrollPosition,
    toggleRowSelection
  };
};
