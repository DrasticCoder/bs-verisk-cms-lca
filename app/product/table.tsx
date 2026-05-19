'use client';

import { z } from 'zod';
import { productSelectSchema } from './schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { UpdateProduct } from './update';
import { DeleteProduct } from './delete';

type Product = z.infer<typeof productSelectSchema>;

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 50,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    header: 'Actions',
    size: 50,
    meta: {
      align: 'right',
    },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex space-x-2">
          <UpdateProduct data={product}>
            <Button variant="outline" size="icon">
              <Pencil />
            </Button>
          </UpdateProduct>
          <DeleteProduct data={product}>
            <Button variant="destructive" size="icon">
              <Trash2 />
            </Button>
          </DeleteProduct>
        </div>
      );
    },
  },
];

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;

export function ProductTable({
  data,
  page,
  perPage,
  total,
}: {
  data: Product[];
  page: number;
  perPage: number;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    params.set('perPage', perPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-xs font-bold">
          Page {page} of {Math.ceil(total / perPage)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(total / perPage)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
