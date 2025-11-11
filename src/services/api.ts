const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

export interface Table {
  table_name: string;
  table_schema: string;
}

export interface TableColumn {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  is_nullable: string;
  column_default: string | null;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/health');
  }

  // Database connection test
  async testDbConnection(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/db/test');
  }

  // Get all tables
  async getTables(schema: string = 'collation_storage'): Promise<{
    status: string;
    tables: Table[];
    schema: string;
  }> {
    return this.request(`/api/db/tables?schema=${schema}`);
  }

  // Get table schema
  async getTableSchema(
    tableName: string,
    schema: string = 'collation_storage'
  ): Promise<{
    status: string;
    schema: TableColumn[];
  }> {
    return this.request(`/api/db/tables/${tableName}/schema?schema=${schema}`);
  }

  // Get table data with pagination
  async getTableData<T = any>(
    tableName: string,
    params: PaginationParams & { schema?: string } = {}
  ): Promise<PaginatedResponse<T>> {
    const { limit = 100, offset = 0, schema = 'collation_storage' } = params;
    return this.request(
      `/api/db/tables/${tableName}/data?limit=${limit}&offset=${offset}&schema=${schema}`
    );
  }

  // Execute custom query
  async executeQuery<T = any>(
    sql: string,
    params: any[] = []
  ): Promise<ApiResponse<T[]> & { rowCount?: number }> {
    return this.request('/api/db/query', {
      method: 'POST',
      body: JSON.stringify({ sql, params }),
    });
  }

  // Specific data fetchers for the Ohio Risk Tool

  // Get all portfolios
  async getPortfolios(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('portfolios', params);
  }

  // Get all securities
  async getSecurities(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('securities', params);
  }

  // Get all transactions
  async getTransactions(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('transactions', params);
  }

  // Get security prices
  async getSecurityPrices(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('security_prices', params);
  }

  // Get fund managers
  async getFundManagers(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('fund_managers', params);
  }

  // Get users
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('users', params);
  }

  // Get entities
  async getEntities(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    return this.getTableData('entities', params);
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing or creating custom instances
export default ApiClient;
