
import { useState, useMemo, useCallback, useEffect } from 'react';
import { GridRow, GridColumn, SortConfig, FilterConfig, GridState, GridConfig, GroupConfig } from '@/types/grid';
import { useWebWorker } from './useWebWorker';
import { toggleGroupExpansion as toggleGroupExpansionUtil } from '@/utils/gridGrouping';

export const usePerformantGridViewModel = (
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

  const [isProcessing, setIsProcessing] = useState(false);
  const { sortData, filterData, groupData, isWorkerAvailable } = useWebWorker();

  // Get ordered columns
  const orderedColumns = useMemo(() => {
    return state.columnOrder
      .map(id => initialColumns.find(col => col.id === id))
      .filter(Boolean) as GridColumn[];
  }, [state.columnOrder, initialColumns]);

  // Process data using web worker or fallback to synchronous processing
  const processDataAsync = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      let result = state.data;
      
      // Filter data
      if (state.filters.length > 0) {
        if (isWorkerAvailable) {
          await new Promise<void>((resolve) => {
            filterData(result, state.filters, (filteredResult, error) => {
              if (error) {
                console.error('Filter worker error:', error);
              } else {
                result = filteredResult;
              }
              resolve();
            });
          });
        } else {
          // Fallback to synchronous filtering
          result = result.filter(row => {
            return state.filters.every(filter => {
              const value = row[filter.field];
              const filterValue = filter.value;
              
              switch (filter.operator) {
                case 'contains':
                  return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
                default:
                  return true;
              }
            });
          });
        }
      }
      
      // Sort data
      if (state.sortConfig) {
        if (isWorkerAvailable) {
          await new Promise<void>((resolve) => {
            sortData(result, state.sortConfig, (sortedResult, error) => {
              if (error) {
                console.error('Sort worker error:', error);
              } else {
                result = sortedResult;
              }
              resolve();
            });
          });
        } else {
          // Fallback to synchronous sorting
          result = [...result].sort((a, b) => {
            const aVal = a[state.sortConfig!.field];
            const bVal = b[state.sortConfig!.field];
            
            if (aVal === bVal) return 0;
            
            const comparison = aVal < bVal ? -1 : 1;
            return state.sortConfig!.direction === 'desc' ? comparison * -1 : comparison;
          });
        }
      }
      
      // Group data
      if (state.groups.length > 0) {
        const expandedArray = Array.from(state.expandedGroups);
        
        if (isWorkerAvailable) {
          await new Promise<void>((resolve) => {
            groupData(result, state.groups, expandedArray, (groupedResult, error) => {
              if (error) {
                console.error('Group worker error:', error);
              } else {
                result = groupedResult;
              }
              resolve();
            });
          });
        } else {
          // Fallback to synchronous grouping
          console.log('Using fallback grouping - consider implementing web worker support');
        }
      }
      
      setState(prev => ({ ...prev, processedData: result }));
    } catch (error) {
      console.error('Data processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [state.data, state.filters, state.sortConfig, state.groups, state.expandedGroups, isWorkerAvailable, sortData, filterData, groupData]);

  // Trigger data processing when dependencies change
  useEffect(() => {
    processDataAsync();
  }, [processDataAsync]);

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
      expandedGroups: toggleGroupExpansionUtil(prev.expandedGroups, groupKey)
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
    processedData: state.processedData,
    isProcessing,
    isWorkerAvailable,
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
