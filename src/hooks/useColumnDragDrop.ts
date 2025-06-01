
import { useState, useCallback } from 'react';
import { GridColumn } from '@/types/grid';

export const useColumnDragDrop = (
  columns: GridColumn[],
  onColumnReorder: (newOrder: string[]) => void
) => {
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

  const handleDragStart = useCallback((columnId: string) => {
    setDraggedColumn(columnId);
  }, []);

  const handleDragOver = useCallback((columnId: string) => {
    if (draggedColumn && columnId !== draggedColumn) {
      setDropTarget(columnId);
    }
  }, [draggedColumn]);

  const handleDragEnd = useCallback(() => {
    if (draggedColumn && dropTarget) {
      const currentOrder = columns.map(col => col.id);
      const draggedIndex = currentOrder.indexOf(draggedColumn);
      const targetIndex = currentOrder.indexOf(dropTarget);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newOrder = [...currentOrder];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumn);
        onColumnReorder(newOrder);
      }
    }

    setDraggedColumn(null);
    setDropTarget(null);
  }, [draggedColumn, dropTarget, columns, onColumnReorder]);

  const handleDragLeave = useCallback(() => {
    setDropTarget(null);
  }, []);

  return {
    draggedColumn,
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
  };
};
