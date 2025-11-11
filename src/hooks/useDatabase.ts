import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient, PaginationParams } from '@/services/api';

// Hook for getting all tables
export const useTables = (schema: string = 'collation_storage') => {
  return useQuery({
    queryKey: ['tables', schema],
    queryFn: () => apiClient.getTables(schema),
  });
};

// Hook for getting table schema
export const useTableSchema = (tableName: string, schema: string = 'collation_storage') => {
  return useQuery({
    queryKey: ['table-schema', tableName, schema],
    queryFn: () => apiClient.getTableSchema(tableName, schema),
    enabled: !!tableName,
  });
};

// Hook for getting table data with pagination
export const useTableData = <T = any>(
  tableName: string,
  params?: PaginationParams & { schema?: string },
  options?: Omit<UseQueryOptions, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['table-data', tableName, params],
    queryFn: () => apiClient.getTableData<T>(tableName, params),
    enabled: !!tableName,
    ...options,
  });
};

// Specific hooks for the Ohio Risk Tool data

// Hook for portfolios
export const usePortfolios = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['portfolios', params],
    queryFn: () => apiClient.getPortfolios(params),
  });
};

// Hook for securities
export const useSecurities = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['securities', params],
    queryFn: () => apiClient.getSecurities(params),
  });
};

// Hook for transactions
export const useTransactions = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.getTransactions(params),
  });
};

// Hook for security prices
export const useSecurityPrices = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['security-prices', params],
    queryFn: () => apiClient.getSecurityPrices(params),
  });
};

// Hook for fund managers
export const useFundManagers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['fund-managers', params],
    queryFn: () => apiClient.getFundManagers(params),
  });
};

// Hook for users
export const useUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiClient.getUsers(params),
  });
};

// Hook for entities
export const useEntities = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['entities', params],
    queryFn: () => apiClient.getEntities(params),
  });
};

// Hook for health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.healthCheck(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook for database connection test
export const useDbConnection = () => {
  return useQuery({
    queryKey: ['db-connection'],
    queryFn: () => apiClient.testDbConnection(),
  });
};
