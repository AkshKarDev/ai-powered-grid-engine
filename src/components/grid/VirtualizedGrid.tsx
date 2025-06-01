
import React, { useRef, useCallback, useState } from 'react';
import { GridColumn, GridRow as GridRowType, GridConfig, GroupedRow } from '@/types/grid';
import { useGridTheme } from './GridThemeProvider';
import GridHeader from './GridHeader';
import GridRow from './GridRow';
import GroupRow from './GroupRow';

interface VirtualizedGridProps {
  data: (GridRowType | GroupedRow)[];
  columns: GridColumn[];
  config: GridConfig;
  sortConfig: any;
  selectedRows: Set<string>;
  onSort: (field: string) => void;
  onFilter: (field: string) => void;
  onGroup: (field: string) => void;
  onRowSelect: (rowId: string) => void;
  onToggleGroup: (groupKey: string) => void;
  onColumnReorder: (newOrder: string[]) => void;
  height: number;
}

const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({
  data,
  columns,
  config,
  sortConfig,
  selectedRows,
  onSort,
  onFilter,
  onGroup,
  onRowSelect,
  onToggleGroup,
  onColumnReorder,
  height
}) => {
  const { theme } = useGridTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const getRowHeight = (row: GridRowType | GroupedRow) => {
    return (row as GroupedRow).isGroup ? config.groupRowHeight : config.rowHeight;
  };

  // Calculate total height considering variable row heights
  const totalHeight = data.reduce((acc, row) => acc + getRowHeight(row), 0);
  const containerHeight = height - config.headerHeight;
  
  // Calculate visible range with variable row heights
  let currentHeight = 0;
  let startIndex = 0;
  let endIndex = data.length;

  for (let i = 0; i < data.length; i++) {
    const rowHeight = getRowHeight(data[i]);
    if (currentHeight + rowHeight > scrollTop - config.overscan * config.rowHeight) {
      startIndex = Math.max(0, i);
      break;
    }
    currentHeight += rowHeight;
  }

  currentHeight = 0;
  for (let i = 0; i < data.length; i++) {
    const rowHeight = getRowHeight(data[i]);
    currentHeight += rowHeight;
    if (currentHeight > scrollTop + containerHeight + config.overscan * config.rowHeight) {
      endIndex = Math.min(data.length, i + 1);
      break;
    }
  }
  
  const visibleRows = data.slice(startIndex, endIndex);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  // Calculate top offset for visible rows
  let topOffset = 0;
  for (let i = 0; i < startIndex; i++) {
    topOffset += getRowHeight(data[i]);
  }

  return (
    <div 
      className="border rounded-lg overflow-hidden"
      style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.borderColor
      }}
    >
      <GridHeader
        columns={columns}
        sortConfig={sortConfig}
        onSort={onSort}
        onFilter={onFilter}
        onGroup={onGroup}
        onColumnReorder={onColumnReorder}
        height={config.headerHeight}
        enableDragging={config.enableColumnDragging}
      />
      
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleRows.map((row, index) => {
            const actualIndex = startIndex + index;
            let currentTop = topOffset;
            
            // Calculate position for this specific row
            for (let i = startIndex; i < startIndex + index; i++) {
              currentTop += getRowHeight(data[i]);
            }

            const isGroupRow = (row as GroupedRow).isGroup;
            
            if (isGroupRow) {
              return (
                <GroupRow
                  key={row.id}
                  row={row as GroupedRow}
                  onToggleGroup={onToggleGroup}
                  height={getRowHeight(row)}
                  style={{
                    position: 'absolute',
                    top: currentTop,
                    left: 0,
                    right: 0
                  }}
                />
              );
            }

            return (
              <GridRow
                key={row.id}
                row={row as GridRowType}
                columns={columns}
                isSelected={selectedRows.has(row.id)}
                onSelect={onRowSelect}
                height={getRowHeight(row)}
                level={(row as GroupedRow).level || 0}
                style={{
                  position: 'absolute',
                  top: currentTop,
                  left: 0,
                  right: 0
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedGrid;
