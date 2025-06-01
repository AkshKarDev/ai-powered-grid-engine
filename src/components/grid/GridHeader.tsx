
import React from 'react';
import { ChevronUp, ChevronDown, Filter, GripVertical, Users } from 'lucide-react';
import { GridColumn, SortConfig } from '@/types/grid';
import { useGridTheme } from './GridThemeProvider';
import { useColumnDragDrop } from '@/hooks/useColumnDragDrop';
import { cn } from '@/lib/utils';

interface GridHeaderProps {
  columns: GridColumn[];
  sortConfig: SortConfig | null;
  onSort: (field: string) => void;
  onFilter: (field: string) => void;
  onGroup: (field: string) => void;
  onColumnReorder: (newOrder: string[]) => void;
  height: number;
  enableDragging: boolean;
}

const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  sortConfig,
  onSort,
  onFilter,
  onGroup,
  onColumnReorder,
  height,
  enableDragging
}) => {
  const { theme } = useGridTheme();
  const {
    draggedColumn,
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
  } = useColumnDragDrop(columns, onColumnReorder);

  const handleSort = (column: GridColumn) => {
    if (!column.sortable) return;
    onSort(column.field);
  };

  const handleDragStartWrapper = (e: React.DragEvent, columnId: string) => {
    if (enableDragging) {
      e.dataTransfer.effectAllowed = 'move';
      handleDragStart(columnId);
    }
  };

  const handleDragOverWrapper = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (enableDragging) {
      handleDragOver(columnId);
    }
  };

  return (
    <div 
      className="flex border-b sticky top-0 z-10"
      style={{ 
        height,
        background: theme.colors.headerBackground,
        borderColor: theme.colors.borderColor,
        color: theme.colors.headerTextColor,
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.headerFontWeight
      }}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className={cn(
            "flex items-center justify-between border-r relative group",
            column.sortable && "cursor-pointer hover:opacity-80",
            draggedColumn === column.id && "opacity-50",
            dropTarget === column.id && "border-blue-400 border-2"
          )}
          style={{ 
            width: column.width || 150,
            minWidth: column.minWidth || 100,
            maxWidth: column.maxWidth || 300,
            borderColor: theme.colors.borderColor,
            padding: theme.spacing.headerPadding
          }}
          draggable={enableDragging && column.draggable !== false}
          onClick={() => handleSort(column)}
          onDragStart={(e) => handleDragStartWrapper(e, column.id)}
          onDragOver={(e) => handleDragOverWrapper(e, column.id)}
          onDragEnd={handleDragEnd}
          onDragLeave={handleDragLeave}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {enableDragging && column.draggable !== false && (
              <GripVertical 
                size={14} 
                className="opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing" 
              />
            )}
            <span className="truncate">
              {column.headerName}
            </span>
          </div>
          
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
                className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
              >
                <Filter size={12} />
              </button>
            )}

            {column.groupable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGroup(column.field);
                }}
                className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100"
              >
                <Users size={12} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridHeader;
