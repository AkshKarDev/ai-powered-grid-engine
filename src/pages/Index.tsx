
import React, { useState } from 'react';
import DataGrid from '@/components/grid/DataGrid';
import PerformantDataGrid from '@/components/grid/PerformantDataGrid';
import { generateMockData, sampleColumns } from '@/utils/generateMockData';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap } from 'lucide-react';

const Index = () => {
  const [theme, setTheme] = useState<'default' | 'dark' | 'compact' | 'modern'>('default');
  const [rowCount, setRowCount] = useState(10000);
  const [useWebWorker, setUseWebWorker] = useState(true);
  
  // Generate mock data
  const mockData = generateMockData(rowCount);

  const themes = [
    { value: 'default', label: 'Default' },
    { value: 'dark', label: 'Dark' },
    { value: 'compact', label: 'Compact' },
    { value: 'modern', label: 'Modern' },
  ] as const;

  const GridComponent = useWebWorker ? PerformantDataGrid : DataGrid;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            High-Performance Data Grid - Phase 3
          </h1>
          <p className="text-gray-600 mb-4">
            Now with Web Worker integration for performance-critical operations!
            Currently displaying {mockData.length.toLocaleString()} rows across {sampleColumns.length} columns.
          </p>
          
          <div className="flex gap-4 items-center mb-4 flex-wrap">
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
            
            <div className="flex gap-2 items-center">
              <Zap size={16} className={useWebWorker ? 'text-green-600' : 'text-gray-400'} />
              <label className="text-sm font-medium text-gray-700">Web Worker:</label>
              <Switch
                checked={useWebWorker}
                onCheckedChange={setUseWebWorker}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <GridComponent
            data={mockData}
            columns={sampleColumns}
            height={700}
            theme={theme}
            enableGrouping={true}
            enableColumnDragging={true}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p className="font-medium mb-2">Phase 3 Features:</p>
          <div className="grid grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-1">
              <li>✅ Web Worker integration for heavy calculations</li>
              <li>✅ Async data processing (sort, filter, group)</li>
              <li>✅ Performance indicators and loading states</li>
              <li>✅ Fallback to synchronous processing</li>
            </ul>
            <ul className="list-disc list-inside space-y-1">
              <li>✅ Optimized for 50K+ rows</li>
              <li>✅ Non-blocking UI during processing</li>
              <li>✅ Toggle between worker and standard modes</li>
              <li>✅ Enhanced status bar with worker indicators</li>
            </ul>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">Phase 3 Performance Features:</p>
            <ul className="text-green-700 text-sm mt-1 space-y-1">
              <li>• Web Workers handle sorting, filtering, and grouping operations</li>
              <li>• Toggle Web Worker mode on/off to compare performance</li>
              <li>• Loading indicators show when heavy processing is happening</li>
              <li>• Try large datasets (25K-50K rows) to see the performance benefits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
