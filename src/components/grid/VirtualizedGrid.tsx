
import React, { useRef, useCallback, useEffect, useState } from 'react';
import { GridColumn, GridRow as GridRowType, GridConfig } from '@/types/grid';
import GridHeader from './GridHeader';
import GridRow from './GridRow';

interface VirtualizedGridProps {
  data: GridRowType[];
  columns: GridColumn[];
  config: GridConfig;
  sortConfig: any;
  selectedRows: Set<string>;
  onSort: (field: string) => void;
  onFilter: (field: string) => void;
  onRowSelect: (rowId: string) => void;
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
  onRowSelect,
  height
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const totalHeight = data.length * config.rowHeight;
  const containerHeight = height - config.headerHeight;
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / config.rowHeight) - config.overscan);
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / config.rowHeight) + config.overscan
  );
  
  const visibleRows = data.slice(startIndex, endIndex);
  
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);
  }, []);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <GridHeader
        columns={columns}
        sortConfig={sortConfig}
        onSort={onSort}
        onFilter={onFilter}
        height={config.headerHeight}
      />
      
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleRows.map((row, index) => (
            <GridRow
              key={row.id}
              row={row}
              columns={columns}
              isSelected={selectedRows.has(row.id)}
              onSelect={onRowSelect}
              height={config.rowHeight}
              style={{
                position: 'absolute',
                top: (startIndex + index) * config.rowHeight,
                left: 0,
                right: 0
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedGrid;
