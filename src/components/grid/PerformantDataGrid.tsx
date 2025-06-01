
import React from 'react';
import { GridColumn, GridRow } from '@/types/grid';
import { usePerformantGridViewModel } from '@/hooks/usePerformantGridViewModel';
import { GridThemeProvider } from './GridThemeProvider';
import VirtualizedGrid from './VirtualizedGrid';
import GridToolbar from './GridToolbar';
import { Loader2, Zap } from 'lucide-react';

interface PerformantDataGridProps {
  data: GridRow[];
  columns: GridColumn[];
  height?: number;
  theme?: 'default' | 'dark' | 'compact' | 'modern';
  enableGrouping?: boolean;
  enableColumnDragging?: boolean;
}

const PerformantDataGrid: React.FC<PerformantDataGridProps> = ({
  data,
  columns,
  height = 600,
  theme = 'default',
  enableGrouping = true,
  enableColumnDragging = true
}) => {
  const {
    state,
    config,
    columns: orderedColumns,
    processedData,
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
    toggleRowSelection
  } = usePerformantGridViewModel(data, columns, {
    rowHeight: 40,
    headerHeight: 50,
    groupRowHeight: 44,
    overscan: 5,
    virtualScrolling: true,
    enableGrouping,
    enableColumnDragging,
    theme
  });

  const handleSort = (field: string) => {
    const currentSort = state.sortConfig;
    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (currentSort?.field === field) {
      if (currentSort.direction === 'asc') {
        newDirection = 'desc';
      } else {
        setSortConfig(null);
        return;
      }
    }
    
    setSortConfig({ field, direction: newDirection });
  };

  const handleFilter = (field: string) => {
    console.log('Filter clicked for field:', field);
  };

  const handleGroup = (field: string) => {
    const isGrouped = state.groups.some(g => g.field === field);
    if (isGrouped) {
      removeGroup(field);
    } else {
      addGroup(field);
    }
  };

  const toolbarHeight = 73;
  const statusBarHeight = 40;
  const gridHeight = height - toolbarHeight - statusBarHeight;

  return (
    <GridThemeProvider initialTheme={theme}>
      <div className="w-full">
        <GridToolbar
          filters={state.filters}
          groups={state.groups}
          onAddFilter={addFilter}
          onRemoveFilter={removeFilter}
          onClearFilters={clearFilters}
          onRemoveGroup={removeGroup}
          onClearGroups={clearGroups}
        />
        
        {isProcessing && (
          <div className="flex items-center justify-center py-2 bg-blue-50 border-b">
            <Loader2 className="animate-spin mr-2" size={16} />
            <span className="text-sm text-blue-700">Processing data...</span>
          </div>
        )}
        
        <VirtualizedGrid
          data={processedData}
          columns={orderedColumns}
          config={config}
          sortConfig={state.sortConfig}
          selectedRows={state.selectedRows}
          onSort={handleSort}
          onFilter={handleFilter}
          onGroup={handleGroup}
          onRowSelect={toggleRowSelection}
          onToggleGroup={toggleGroupExpansion}
          onColumnReorder={reorderColumns}
          height={gridHeight}
        />
        
        <div 
          className="px-4 py-2 border-t text-sm flex items-center justify-between"
          style={{
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            color: '#6b7280'
          }}
        >
          <div>
            Showing {processedData.length} of {state.data.length} rows
            {state.selectedRows.size > 0 && ` • ${state.selectedRows.size} selected`}
            {state.groups.length > 0 && ` • Grouped by ${state.groups.map(g => g.field).join(', ')}`}
          </div>
          
          <div className="flex items-center gap-2">
            {isWorkerAvailable && (
              <div className="flex items-center gap-1 text-green-600">
                <Zap size={14} />
                <span className="text-xs">Web Worker Active</span>
              </div>
            )}
            {isProcessing && (
              <div className="flex items-center gap-1 text-blue-600">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-xs">Processing</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </GridThemeProvider>
  );
};

export default PerformantDataGrid;
