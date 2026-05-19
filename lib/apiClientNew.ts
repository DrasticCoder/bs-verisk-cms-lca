import type { Product } from '@/app/product/schema';

type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
};

export type PaginationParams = {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  private buildQueryString(
    params: Record<string, string | number | boolean | undefined | null>,
  ): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value.toString());
      }
    });
    return query.toString();
  }

  // Product methods
  async getProducts(params?: PaginationParams) {
    const queryString = this.buildQueryString(params || {});
    return this.request<PaginatedResponse<Product>>(
      `/products${queryString ? `?${queryString}` : ''}`,
    );
  }

  async createProduct(data: { name: string }) {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: { name: string }) {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Account methods (placeholder types for now)
  async getAccounts(params?: PaginationParams & { productId?: string }) {
    const queryString = this.buildQueryString(params || {});
    return this.request<PaginatedResponse<Record<string, unknown>>>(
      `/accounts${queryString ? `?${queryString}` : ''}`,
    );
  }

  async createAccount(data: {
    name: string;
    parentId?: string;
    isGroup: boolean;
    productId: string;
  }) {
    return this.request<Record<string, unknown>>('/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAccount(
    id: string,
    data: {
      name: string;
      parentId?: string;
      isGroup: boolean;
      productId: string;
    },
  ) {
    return this.request<Record<string, unknown>>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string) {
    return this.request<{ success: boolean }>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };
