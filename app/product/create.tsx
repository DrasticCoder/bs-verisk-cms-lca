'use client';

import { z } from 'zod';
import { productInsertSchema } from './schema';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductForm } from './form';
import { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { useCreateProduct } from '@/hooks/use-queries';

interface Props {
  children: JSX.Element;
}

export function CreateProduct({ children }: Props) {
  const createProductMutation = useCreateProduct();

  async function createProduct(data: z.infer<typeof productInsertSchema>) {
    createProductMutation.mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          onSubmit={createProduct}
          submitAction={
            <DialogClose asChild>
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogClose>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
