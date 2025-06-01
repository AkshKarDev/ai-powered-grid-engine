
import React from 'react';
import DataGrid from '@/components/grid/DataGrid';
import { generateMockData, sampleColumns } from '@/utils/generateMockData';

const Index = () => {
  // Generate a large dataset for testing
  const mockData = generateMockData(10000); // Start with 10K rows for testing

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            High-Performance Data Grid
          </h1>
          <p className="text-gray-600">
            MVVM-based virtualized grid with sorting, filtering, and row selection. 
            Currently displaying {mockData.length.toLocaleString()} rows across {sampleColumns.length} columns.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <DataGrid
            data={mockData}
            columns={sampleColumns}
            height={700}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Features implemented:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Virtual scrolling for performance with large datasets</li>
            <li>MVVM architecture with proper separation of concerns</li>
            <li>Sortable columns (click headers to sort)</li>
            <li>Advanced filtering with multiple operators</li>
            <li>Row selection and multi-selection</li>
            <li>Responsive design with Tailwind CSS</li>
            <li>Column formatting and type-aware operations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
