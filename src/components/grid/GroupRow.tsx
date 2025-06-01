
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { GroupedRow } from '@/types/grid';
import { useGridTheme } from './GridThemeProvider';
import { cn } from '@/lib/utils';

interface GroupRowProps {
  row: GroupedRow;
  onToggleGroup: (groupKey: string) => void;
  height: number;
  style?: React.CSSProperties;
}

const GroupRow: React.FC<GroupRowProps> = ({
  row,
  onToggleGroup,
  height,
  style
}) => {
  const { theme } = useGridTheme();

  const handleToggle = () => {
    onToggleGroup(row.id);
  };

  return (
    <div
      className={cn(
        "flex items-center px-3 py-2 border-b cursor-pointer font-medium",
        "hover:opacity-80 transition-opacity"
      )}
      style={{
        height,
        backgroundColor: theme.colors.groupRowBackground,
        borderColor: theme.colors.borderColor,
        color: theme.colors.textColor,
        paddingLeft: `${(row.level || 0) * 20 + 12}px`,
        ...style
      }}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2">
        {row.isExpanded ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
        <span>
          {row.groupField}: {row.groupValue} ({row.count} items)
        </span>
      </div>
    </div>
  );
};

export default GroupRow;
