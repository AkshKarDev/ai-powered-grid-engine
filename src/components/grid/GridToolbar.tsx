
import React, { useState } from 'react';
import { Search, X, FilterX, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilterConfig, GroupConfig } from '@/types/grid';

interface GridToolbarProps {
  filters: FilterConfig[];
  groups: GroupConfig[];
  onAddFilter: (filter: FilterConfig) => void;
  onRemoveFilter: (field: string) => void;
  onClearFilters: () => void;
  onRemoveGroup: (field: string) => void;
  onClearGroups: () => void;
}

const GridToolbar: React.FC<GridToolbarProps> = ({
  filters,
  groups,
  onAddFilter,
  onRemoveFilter,
  onClearFilters,
  onRemoveGroup,
  onClearGroups
}) => {
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleQuickSearch = () => {
    if (searchField && searchValue) {
      onAddFilter({
        field: searchField,
        operator: 'contains',
        value: searchValue
      });
      setSearchValue('');
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border-b">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Field name"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          className="w-32"
        />
        <Input
          placeholder="Search value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-48"
          onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
        />
        <Button onClick={handleQuickSearch} size="sm">
          <Search size={16} />
        </Button>
      </div>

      {filters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.map((filter) => (
            <div
              key={filter.field}
              className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-sm"
            >
              <span>{filter.field}: {filter.value}</span>
              <button
                onClick={() => onRemoveFilter(filter.field)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <Button
            onClick={onClearFilters}
            variant="outline"
            size="sm"
          >
            <FilterX size={16} />
            Clear All
          </Button>
        </div>
      )}

      {groups.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active groups:</span>
          {groups.map((group) => (
            <div
              key={group.field}
              className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded text-sm"
            >
              <Users size={14} />
              <span>{group.field}</span>
              <button
                onClick={() => onRemoveGroup(group.field)}
                className="text-green-600 hover:text-green-800"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <Button
            onClick={onClearGroups}
            variant="outline"
            size="sm"
          >
            <Users size={16} />
            Clear Groups
          </Button>
        </div>
      )}
    </div>
  );
};

export default GridToolbar;
