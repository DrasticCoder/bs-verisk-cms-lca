'use client';

import { z } from 'zod';
import { productInsertSchema, productSelectSchema } from './schema';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductForm } from './form';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateProduct } from '@/hooks/use-queries';

interface Props {
  data: z.infer<typeof productSelectSchema>;
  children: JSX.Element;
}

export function UpdateProduct({ data, children }: Props) {
  const updateProductMutation = useUpdateProduct();

  async function updateProduct(
    updateData: z.infer<typeof productInsertSchema>,
  ) {
    updateProductMutation.mutate({ id: data.id, data: updateData });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          data={data}
          onSubmit={updateProduct}
          submitAction={
            <DialogClose asChild>
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
