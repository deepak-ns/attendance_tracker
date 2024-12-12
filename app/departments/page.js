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

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 5;

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setIsLoading(true);
        const { from, to } = getPagination(page, pageSize);
        
        const { count } = await supabase
          .from('departments')
          .select('*', { count: 'exact', head: true });
  
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .range(from, to)
          .order('created_at', { ascending: false });
  
        if (error) throw error;
  
        setDepartments(data);
        setTotalPages(Math.ceil(count / pageSize));
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDepartments();
  }, [page]);

  if (isLoading) return <Loader2 className='mx-auto animate-spin w-12 h-12' />;

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Departments</h1>
        
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.code}</TableCell>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
            >
              Previous
            </Button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <Button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
  );
}