'use client';

import { useState, useEffect } from 'react';
import {
  testDatabaseConnection,
  testTableQueries,
} from '@/lib/utils/supabase-test';
import { Card } from '@/components/ui/card';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [tableResults, setTableResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      try {
        setIsLoading(true);
  
        // Test database connection
        const isConnected = await testDatabaseConnection();
        setConnectionStatus(isConnected);
  
        // Test table queries
        const results = await testTableQueries();
        setTableResults(results);
      } catch (error) {
        console.error('Error running tests:', error);
      } finally {
        setIsLoading(false);
      }
    }
    runTests();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Database Connection Tests</h1>

      {isLoading ? (
        <p>Running tests...</p>
      ) : (
        <>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <p className={connectionStatus ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus ? '✅ Connected' : '❌ Not Connected'}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Table Query Tests</h2>
            {tableResults &&
              Object.entries(tableResults).map(([table, result]) => (
                <div key={table} className="mb-2">
                  <p
                    className={
                      result.success ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {result.message}
                  </p>
                </div>
              ))}
          </Card>
        </>
      )}
    </div>
  );
}
