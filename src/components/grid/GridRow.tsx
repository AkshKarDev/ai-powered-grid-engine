
import React from 'react';
import { GridColumn, GridRow as GridRowType } from '@/types/grid';
import { useGridTheme } from './GridThemeProvider';
import { cn } from '@/lib/utils';

interface GridRowProps {
  row: GridRowType;
  columns: GridColumn[];
  isSelected: boolean;
  onSelect: (rowId: string) => void;
  height: number;
  level?: number;
  style?: React.CSSProperties;
}

const GridRow: React.FC<GridRowProps> = ({
  row,
  columns,
  isSelected,
  onSelect,
  height,
  level = 0,
  style
}) => {
  const { theme } = useGridTheme();

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
        "flex border-b cursor-pointer transition-colors",
        "hover:opacity-80"
      )}
      style={{ 
        height, 
        backgroundColor: isSelected 
          ? theme.colors.selectedRowBackground 
          : theme.colors.rowBackground,
        borderColor: theme.colors.borderColor,
        color: isSelected ? theme.colors.selectedTextColor : theme.colors.textColor,
        fontSize: theme.typography.fontSize,
        fontWeight: theme.typography.fontWeight,
        ...style 
      }}
      onClick={() => onSelect(row.id)}
    >
      {columns.map((column, index) => (
        <div
          key={column.id}
          className="flex items-center border-r truncate"
          style={{ 
            width: column.width || 150,
            minWidth: column.minWidth || 100,
            maxWidth: column.maxWidth || 300,
            borderColor: theme.colors.borderColor,
            padding: theme.spacing.cellPadding,
            paddingLeft: index === 0 ? `${level * 20 + 12}px` : theme.spacing.cellPadding
          }}
          title={formatCellValue(row[column.field], column)}
        >
          <span className="truncate">
            {formatCellValue(row[column.field], column)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GridRow;
