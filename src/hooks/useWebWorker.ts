
import { useRef, useCallback, useEffect } from 'react';
import { WorkerMessage, WorkerResponse } from '../workers/gridWorker';

export const useWebWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (result: any, error?: string) => void>>(new Map());
  
  useEffect(() => {
    // Create worker
    const worker = new Worker(
      new URL('../workers/gridWorker.ts', import.meta.url),
      { type: 'module' }
    );
    
    workerRef.current = worker;
    
    // Handle worker messages
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const { type, result, error } = e.data;
      const callback = callbacksRef.current.get(type);
      
      if (callback) {
        callback(result, error);
        callbacksRef.current.delete(type);
      }
    };
    
    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);
  
  const processData = useCallback((
    message: WorkerMessage,
    callback: (result: any, error?: string) => void
  ) => {
    if (!workerRef.current) {
      callback(null, 'Worker not available');
      return;
    }
    
    callbacksRef.current.set(message.type, callback);
    workerRef.current.postMessage(message);
  }, []);
  
  const sortData = useCallback((data: any[], sortConfig: any, callback: (result: any, error?: string) => void) => {
    processData({ type: 'SORT', data, sortConfig }, callback);
  }, [processData]);
  
  const filterData = useCallback((data: any[], filters: any[], callback: (result: any, error?: string) => void) => {
    processData({ type: 'FILTER', data, filters }, callback);
  }, [processData]);
  
  const groupData = useCallback((
    data: any[], 
    groups: any[], 
    expandedGroups: string[], 
    callback: (result: any, error?: string) => void
  ) => {
    processData({ type: 'GROUP', data, groups, expandedGroups }, callback);
  }, [processData]);
  
  return {
    sortData,
    filterData,
    groupData,
    isWorkerAvailable: !!workerRef.current
  };
};
