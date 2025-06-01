
export interface GridColumn {
  id: string;
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => string;
}

export interface GridRow {
  id: string;
  [key: string]: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface GridState {
  data: GridRow[];
  filteredData: GridRow[];
  sortConfig: SortConfig | null;
  filters: FilterConfig[];
  selectedRows: Set<string>;
  scrollTop: number;
  scrollLeft: number;
}

export interface GridConfig {
  rowHeight: number;
  headerHeight: number;
  overscan: number;
  virtualScrolling: boolean;
}
