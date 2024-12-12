'use client';

import { useState } from 'react';
import AttendanceSummary from '@/components/attendance/AttendanceSummary';
import AttendanceFilters from '@/components/attendance/AttendanceFilters';
import AttendanceStats from '@/components/attendance/AttendanceStats';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import OverviewStats from '@/components/attendance/OverviewStats';

export default function HomePage() {
  const [filters, setFilters] = useState(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Overview Statistics */}
      <OverviewStats />
      
      {/* Weekly Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceSummary />
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Quick Filters</h2>
          <AttendanceFilters onFilterChange={setFilters} />
        </div>
      </div>
      
      {/* Detailed Statistics and Table */}
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceStats filters={filters} />
        <AttendanceTable filters={filters} />
      </div>
    </div>
  );
}