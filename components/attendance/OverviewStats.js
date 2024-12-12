'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { UserRound, Presentation, UserRoundPen } from 'lucide-react';

export default function OverviewStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsCount, teachersCount, classesCount] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('teachers').select('*', { count: 'exact', head: true }),
          supabase.from('classes').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          students: studentsCount.count,
          teachers: teachersCount.count,
          classes: classesCount.count
        });
      } catch (error) {
        console.error('Error fetching overview stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <UserRound className="h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            <h3 className="text-2xl font-bold">{stats?.students || 0}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <UserRoundPen className="h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
            <h3 className="text-2xl font-bold">{stats?.teachers || 0}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Presentation className="h-10 w-10 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
            <h3 className="text-2xl font-bold">{stats?.classes || 0}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
}