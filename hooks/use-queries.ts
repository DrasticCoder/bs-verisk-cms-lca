import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClientNew';
import { PaginationParams } from '@/lib/apiClientNew';
import { toast } from '@/hooks/use-toast';

// Product hooks
export function useProducts(params?: PaginationParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => apiClient.getProducts(params),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => apiClient.createProduct(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create product',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create product',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      apiClient.updateProduct(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update product',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteProduct(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete product',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    },
  });
}

// Account hooks
export function useAccounts(
  params?: PaginationParams & { productId?: string },
) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => apiClient.getAccounts(params),
    select: (data) => (data.success ? data.data : null),
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      parentId?: string;
      isGroup: boolean;
      productId: string;
    }) => apiClient.createAccount(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        toast({
          title: 'Success',
          description: 'Account created successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to create account',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
        parentId?: string;
        isGroup: boolean;
        productId: string;
      };
    }) => apiClient.updateAccount(id, data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        toast({
          title: 'Success',
          description: 'Account updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to update account',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update account',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteAccount(id),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        toast({
          title: 'Success',
          description: 'Account deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete account',
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete account',
        variant: 'destructive',
      });
    },
  });
}
