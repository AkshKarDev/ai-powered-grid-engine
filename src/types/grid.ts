
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
  draggable?: boolean;
  groupable?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean';
  formatter?: (value: any) => string;
  aggregator?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface GridRow {
  id: string;
  [key: string]: any;
}

export interface GroupedRow extends GridRow {
  isGroup: boolean;
  groupField?: string;
  groupValue?: any;
  children?: GridRow[];
  isExpanded?: boolean;
  level?: number;
  count?: number;
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

export interface GroupConfig {
  field: string;
  expanded: boolean;
}

export interface GridState {
  data: GridRow[];
  filteredData: GridRow[];
  processedData: (GridRow | GroupedRow)[];
  sortConfig: SortConfig | null;
  filters: FilterConfig[];
  groups: GroupConfig[];
  selectedRows: Set<string>;
  scrollTop: number;
  scrollLeft: number;
  columnOrder: string[];
  expandedGroups: Set<string>;
}

export interface GridConfig {
  rowHeight: number;
  headerHeight: number;
  groupRowHeight: number;
  overscan: number;
  virtualScrolling: boolean;
  enableGrouping: boolean;
  enableColumnDragging: boolean;
  theme: 'default' | 'dark' | 'compact' | 'modern';
}

export interface GridTheme {
  name: string;
  colors: {
    background: string;
    headerBackground: string;
    rowBackground: string;
    alternateRowBackground: string;
    selectedRowBackground: string;
    groupRowBackground: string;
    borderColor: string;
    textColor: string;
    headerTextColor: string;
    selectedTextColor: string;
  };
  spacing: {
    cellPadding: string;
    headerPadding: string;
  };
  typography: {
    fontSize: string;
    fontWeight: string;
    headerFontWeight: string;
  };
}
