
import React, { useState } from 'react';
import DataGrid from '@/components/grid/DataGrid';
import { generateMockData, sampleColumns } from '@/utils/generateMockData';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [theme, setTheme] = useState<'default' | 'dark' | 'compact' | 'modern'>('default');
  const [rowCount, setRowCount] = useState(10000);
  
  // Generate mock data
  const mockData = generateMockData(rowCount);

  const themes = [
    { value: 'default', label: 'Default' },
    { value: 'dark', label: 'Dark' },
    { value: 'compact', label: 'Compact' },
    { value: 'modern', label: 'Modern' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            High-Performance Data Grid - Phase 2
          </h1>
          <p className="text-gray-600 mb-4">
            Advanced features: Grouping, Column Drag & Drop, Custom Themes, and more!
            Currently displaying {mockData.length.toLocaleString()} rows across {sampleColumns.length} columns.
          </p>
          
          <div className="flex gap-4 items-center mb-4">
            <div className="flex gap-2">
              <label className="text-sm font-medium text-gray-700">Theme:</label>
              {themes.map((t) => (
                <Button
                  key={t.value}
                  variant={theme === t.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium text-gray-700">Rows:</label>
              <select 
                value={rowCount} 
                onChange={(e) => setRowCount(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value={1000}>1K</option>
                <option value={5000}>5K</option>
                <option value={10000}>10K</option>
                <option value={25000}>25K</option>
                <option value={50000}>50K</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <DataGrid
            data={mockData}
            columns={sampleColumns}
            height={700}
            theme={theme}
            enableGrouping={true}
            enableColumnDragging={true}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium mb-2">Phase 2 Features:</p>
          <div className="grid grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-1">
              <li>✅ Group data by any column (click Users icon in header)</li>
              <li>✅ Expand/collapse groups with counts</li>
              <li>✅ Drag & drop columns to reorder</li>
              <li>✅ Custom themes (Default, Dark, Compact, Modern)</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>✅ MVVM architecture with proper separation</li>
              <li>✅ Virtual scrolling with variable row heights</li>
              <li>✅ Themed styling throughout</li>
              <li>✅ Enhanced toolbar with group management</li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">How to use:</p>
            <ul className="text-blue-700 text-sm mt-1 space-y-1">
              <li>• Click the Users icon in column headers to group by that field</li>
              <li>• Drag column headers to reorder columns</li>
              <li>• Try different themes to see the visual changes</li>
              <li>• Click group rows to expand/collapse them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
