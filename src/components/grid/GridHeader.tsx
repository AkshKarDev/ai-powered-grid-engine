
import React from 'react';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { GridColumn, SortConfig } from '@/types/grid';
import { cn } from '@/lib/utils';

interface GridHeaderProps {
  columns: GridColumn[];
  sortConfig: SortConfig | null;
  onSort: (field: string) => void;
  onFilter: (field: string) => void;
  height: number;
}

const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  sortConfig,
  onSort,
  onFilter,
  height
}) => {
  const handleSort = (column: GridColumn) => {
    if (!column.sortable) return;
    onSort(column.field);
  };

  return (
    <div 
      className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10"
      style={{ height }}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            "flex items-center justify-between px-3 py-2 border-r border-gray-200 bg-gray-50",
            column.sortable && "cursor-pointer hover:bg-gray-100"
          )}
          style={{ 
            width: column.width || 150,
            minWidth: column.minWidth || 100,
            maxWidth: column.maxWidth || 300
          }}
          onClick={() => handleSort(column)}
        >
          <span className="font-medium text-gray-700 truncate">
            {column.headerName}
          </span>
          
          <div className="flex items-center gap-1 ml-2">
            {column.sortable && (
              <div className="flex flex-col">
                {sortConfig?.field === column.field && sortConfig.direction === 'asc' ? (
                  <ChevronUp size={14} className="text-blue-600" />
                ) : sortConfig?.field === column.field && sortConfig.direction === 'desc' ? (
                  <ChevronDown size={14} className="text-blue-600" />
                ) : (
                  <div className="w-3.5 h-3.5" />
                )}
              </div>
            )}
            
            {column.filterable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFilter(column.field);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Filter size={12} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridHeader;
