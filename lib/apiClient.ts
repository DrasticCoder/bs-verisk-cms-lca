type ApiResponse<T> = {
  data?: T;
  error?: string;
  success: boolean;
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

  // Product methods
  async getProducts(params?: { page?: number; perPage?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.perPage) query.append('perPage', params.perPage.toString());

    const queryString = query.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(data: { name: string }) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: { name: string }) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Account methods
  async getAccounts(params?: {
    page?: number;
    perPage?: number;
    productId?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.perPage) query.append('perPage', params.perPage.toString());
    if (params?.productId) query.append('productId', params.productId);

    const queryString = query.toString();
    return this.request(`/accounts${queryString ? `?${queryString}` : ''}`);
  }

  async createAccount(data: {
    name: string;
    parentId?: string;
    isGroup: boolean;
    productId: string;
  }) {
    return this.request('/accounts', {
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
    return this.request(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(id: string) {
    return this.request(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Cost Center methods
  async getCostCenters(params?: { page?: number; perPage?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.perPage) query.append('perPage', params.perPage.toString());

    const queryString = query.toString();
    return this.request(`/cost-centers${queryString ? `?${queryString}` : ''}`);
  }

  async createCostCenter(data: { name: string; costCenterCategoryId: string }) {
    return this.request('/cost-centers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCostCenter(
    id: string,
    data: { name: string; costCenterCategoryId: string },
  ) {
    return this.request(`/cost-centers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCostCenter(id: string) {
    return this.request(`/cost-centers/${id}`, {
      method: 'DELETE',
    });
  }

  // Cost Center Category methods
  async getCostCenterCategories(params?: { page?: number; perPage?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.perPage) query.append('perPage', params.perPage.toString());

    const queryString = query.toString();
    return this.request(
      `/cost-center-categories${queryString ? `?${queryString}` : ''}`,
    );
  }

  async createCostCenterCategory(data: { name: string }) {
    return this.request('/cost-center-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCostCenterCategory(id: string, data: { name: string }) {
    return this.request(`/cost-center-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCostCenterCategory(id: string) {
    return this.request(`/cost-center-categories/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };
