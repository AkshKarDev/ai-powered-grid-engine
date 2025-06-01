
// Web Worker for grid data processing
export interface WorkerMessage {
  type: 'SORT' | 'FILTER' | 'GROUP';
  data: any;
  sortConfig?: any;
  filters?: any[];
  groups?: any[];
  expandedGroups?: string[];
}

export interface WorkerResponse {
  type: string;
  result: any;
  error?: string;
}

// Sort function
const sortData = (data: any[], sortConfig: any): any[] => {
  if (!sortConfig) return data;

  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.field];
    const bVal = b[sortConfig.field];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
  });
};

// Filter function
const filterData = (data: any[], filters: any[]): any[] => {
  if (filters.length === 0) return data;

  return data.filter(row => {
    return filters.every(filter => {
      const value = row[filter.field];
      const filterValue = filter.value;

      switch (filter.operator) {
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        case 'equals':
          return value === filterValue;
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
        case 'gt':
          return Number(value) > Number(filterValue);
        case 'lt':
          return Number(value) < Number(filterValue);
        case 'gte':
          return Number(value) >= Number(filterValue);
        case 'lte':
          return Number(value) <= Number(filterValue);
        default:
          return true;
      }
    });
  });
};

// Group function
const groupData = (data: any[], groups: any[], expandedGroups: string[]): any[] => {
  if (groups.length === 0) return data;

  const expandedSet = new Set(expandedGroups);
  const groupField = groups[0].field;
  const grouped = new Map<any, any[]>();

  data.forEach(row => {
    const groupValue = row[groupField];
    if (!grouped.has(groupValue)) {
      grouped.set(groupValue, []);
    }
    grouped.get(groupValue)!.push(row);
  });

  const result: any[] = [];

  Array.from(grouped.entries())
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .forEach(([groupValue, rows]) => {
      const groupKey = `${groupField}_${groupValue}`;
      const isExpanded = expandedSet.has(groupKey);

      const groupRow = {
        id: groupKey,
        isGroup: true,
        groupField,
        groupValue,
        children: rows,
        isExpanded,
        level: 0,
        count: rows.length,
        [groupField]: groupValue,
      };

      result.push(groupRow);

      if (isExpanded) {
        rows.forEach(row => {
          result.push({
            ...row,
            isGroup: false,
            level: 1,
          });
        });
      }
    });

  return result;
};

// Worker message handler
self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { type, data, sortConfig, filters, groups, expandedGroups } = e.data;
  
  try {
    let result: any;
    
    switch (type) {
      case 'SORT':
        result = sortData(data, sortConfig);
        break;
      case 'FILTER':
        result = filterData(data, filters || []);
        break;
      case 'GROUP':
        result = groupData(data, groups || [], expandedGroups || []);
        break;
      default:
        throw new Error(`Unknown worker message type: ${type}`);
    }
    
    const response: WorkerResponse = { type, result };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = { 
      type, 
      result: null, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
    self.postMessage(response);
  }
};
