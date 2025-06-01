
import React from 'react';
import { GridColumn, GridRow as GridRowType } from '@/types/grid';
import { cn } from '@/lib/utils';

interface GridRowProps {
  row: GridRowType;
  columns: GridColumn[];
  isSelected: boolean;
  onSelect: (rowId: string) => void;
  height: number;
  style?: React.CSSProperties;
}

const GridRow: React.FC<GridRowProps> = ({
  row,
  columns,
  isSelected,
  onSelect,
  height,
  style
}) => {
  const formatCellValue = (value: any, column: GridColumn): string => {
    if (column.formatter) {
      return column.formatter(value);
    }
    
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value);
  };

  return (
    <div
      className={cn(
        "flex border-b border-gray-200 hover:bg-gray-50 cursor-pointer",
        isSelected && "bg-blue-50 border-blue-200"
      )}
      style={{ height, ...style }}
      onClick={() => onSelect(row.id)}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex items-center px-3 py-2 border-r border-gray-200 truncate"
          style={{ 
            width: column.width || 150,
            minWidth: column.minWidth || 100,
            maxWidth: column.maxWidth || 300
          }}
          title={formatCellValue(row[column.field], column)}
        >
          <span className="text-sm text-gray-900">
            {formatCellValue(row[column.field], column)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GridRow;
