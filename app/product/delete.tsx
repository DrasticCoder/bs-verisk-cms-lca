'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { JSX } from 'react';
import { z } from 'zod';
import { productSelectSchema } from './schema';
import { Button } from '@/components/ui/button';
import { useDeleteProduct } from '@/hooks/use-queries';

export function DeleteProduct({
  data,
  children,
}: {
  data: z.infer<typeof productSelectSchema>;
  children: JSX.Element;
}) {
  const deleteProductMutation = useDeleteProduct();

  async function onConfirmDelete() {
    deleteProductMutation.mutate(data.id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you absolutely sure you want to delete product{' '}
            <b>{data.name}</b>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={onConfirmDelete}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending ? 'Deleting...' : 'Yes, delete'}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
