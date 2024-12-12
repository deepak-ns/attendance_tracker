'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getPagination } from '@/lib/utils/pagination';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    async function fetchClasses() {
      try {
        setIsLoading(true);
        const { from, to } = getPagination(page, pageSize);

        const { count } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true });

        const { data, error } = await supabase
          .from('classes')
          .select(
            `
            *,
            subjects (name),
            teachers (first_name, last_name)
          `
          )
          .range(from, to)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setClasses(data);
        setTotalPages(Math.ceil(count / pageSize));
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClasses();
  }, [page]);

  if (isLoading) return <Loader2 className='mx-auto animate-spin w-12 h-12' />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Classes</h1>
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Academic Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.subjects?.name}</TableCell>
                <TableCell>
                  {classItem.teachers?.first_name}{' '}
                  {classItem.teachers?.last_name}
                </TableCell>
                <TableCell>{classItem.semester}</TableCell>
                <TableCell>{classItem.academic_year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
          >
            Previous
          </Button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
