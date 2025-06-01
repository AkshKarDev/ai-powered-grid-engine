
import { GridRow, GroupedRow, GroupConfig } from '@/types/grid';

export const groupData = (
  data: GridRow[],
  groups: GroupConfig[],
  expandedGroups: Set<string>
): (GridRow | GroupedRow)[] => {
  if (groups.length === 0) {
    return data;
  }

  const groupField = groups[0].field;
  const grouped = new Map<any, GridRow[]>();

  // Group the data by the first group field
  data.forEach(row => {
    const groupValue = row[groupField];
    if (!grouped.has(groupValue)) {
      grouped.set(groupValue, []);
    }
    grouped.get(groupValue)!.push(row);
  });

  const result: (GridRow | GroupedRow)[] = [];

  // Convert to grouped rows
  Array.from(grouped.entries())
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .forEach(([groupValue, rows]) => {
      const groupKey = `${groupField}_${groupValue}`;
      const isExpanded = expandedGroups.has(groupKey);

      // Add group header
      const groupRow: GroupedRow = {
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

      // Add child rows if expanded
      if (isExpanded) {
        rows.forEach(row => {
          result.push({
            ...row,
            isGroup: false,
            level: 1,
          } as GroupedRow);
        });
      }
    });

  return result;
};

export const toggleGroupExpansion = (
  expandedGroups: Set<string>,
  groupKey: string
): Set<string> => {
  const newExpanded = new Set(expandedGroups);
  if (newExpanded.has(groupKey)) {
    newExpanded.delete(groupKey);
  } else {
    newExpanded.add(groupKey);
  }
  return newExpanded;
};
