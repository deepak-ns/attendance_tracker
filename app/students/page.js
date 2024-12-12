'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 5;

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true);
      const { from, to } = getPagination(page, pageSize);
      
      const { count } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      const { data, error } = await supabase
        .from('students')
        .select('*, departments(name)')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStudents(data);
      setTotalPages(Math.ceil(count / pageSize));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  if (isLoading) return <Loader2 className='mx-auto animate-spin w-12 h-12' />;

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Students</h1>
      
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Student Number</TableHead>
                <TableHead className="whitespace-nowrap">Department</TableHead>
                <TableHead className="whitespace-nowrap">Section</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="whitespace-nowrap">
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{student.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{student.student_number}</TableCell>
                  <TableCell className="whitespace-nowrap">{student.departments?.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{student.section}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <Button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}