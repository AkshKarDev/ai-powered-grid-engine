
import React from 'react';
import { GridColumn, GridRow } from '@/types/grid';
import { useGridViewModel } from '@/hooks/useGridViewModel';
import VirtualizedGrid from './VirtualizedGrid';
import GridToolbar from './GridToolbar';

interface DataGridProps {
  data: GridRow[];
  columns: GridColumn[];
  height?: number;
}

const DataGrid: React.FC<DataGridProps> = ({
  data,
  columns,
  height = 600
}) => {
  const {
    state,
    config,
    processedData,
    setSortConfig,
    addFilter,
    removeFilter,
    clearFilters,
    toggleRowSelection
  } = useGridViewModel(data, columns);

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
    // For now, we'll use the toolbar for filtering
    console.log('Filter clicked for field:', field);
  };

  const toolbarHeight = 73; // Approximate toolbar height
  const gridHeight = height - toolbarHeight;

  return (
    <div className="w-full">
      <GridToolbar
        filters={state.filters}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
      />
      
      <VirtualizedGrid
        data={processedData}
        columns={columns}
        config={config}
        sortConfig={state.sortConfig}
        selectedRows={state.selectedRows}
        onSort={handleSort}
        onFilter={handleFilter}
        onRowSelect={toggleRowSelection}
        height={gridHeight}
      />
      
      <div className="px-4 py-2 bg-gray-50 border-t text-sm text-gray-600">
        Showing {processedData.length} of {state.data.length} rows
        {state.selectedRows.size > 0 && ` • ${state.selectedRows.size} selected`}
      </div>
    </div>
  );
};

export default DataGrid;
