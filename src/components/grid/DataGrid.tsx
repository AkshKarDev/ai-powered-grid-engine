
import React from 'react';
import { GridColumn, GridRow } from '@/types/grid';
import { useGridViewModel } from '@/hooks/useGridViewModel';
import { GridThemeProvider } from './GridThemeProvider';
import VirtualizedGrid from './VirtualizedGrid';
import GridToolbar from './GridToolbar';

interface DataGridProps {
  data: GridRow[];
  columns: GridColumn[];
  height?: number;
  theme?: 'default' | 'dark' | 'compact' | 'modern';
  enableGrouping?: boolean;
  enableColumnDragging?: boolean;
}

const DataGrid: React.FC<DataGridProps> = ({
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
  } = useGridViewModel(data, columns, {
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
  const gridHeight = height - toolbarHeight;

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
          className="px-4 py-2 border-t text-sm"
          style={{
            backgroundColor: '#f9fafb',
            borderColor: '#e5e7eb',
            color: '#6b7280'
          }}
        >
          Showing {processedData.length} of {state.data.length} rows
          {state.selectedRows.size > 0 && ` • ${state.selectedRows.size} selected`}
          {state.groups.length > 0 && ` • Grouped by ${state.groups.map(g => g.field).join(', ')}`}
        </div>
      </div>
    </GridThemeProvider>
  );
};

export default DataGrid;
