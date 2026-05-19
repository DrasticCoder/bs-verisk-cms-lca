'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { productInsertSchema } from './schema';
import { JSX } from 'react/jsx-runtime';

interface Props {
  data?: { name?: string | null };
  submitAction: JSX.Element;
  onSubmit(values: z.infer<typeof productInsertSchema>): void;
}

export function ProductForm(props: Props) {
  const form = useForm<z.infer<typeof productInsertSchema>>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      name: props.data?.name ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="sample 123" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        {props.submitAction}
      </form>
    </Form>
  );
}
