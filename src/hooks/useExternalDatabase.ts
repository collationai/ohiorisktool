import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api";

export interface QueryOptions {
  query: string;
  params?: any[];
  enabled?: boolean;
  refetchInterval?: number;
}

export const useExternalDatabase = <T = any>({
  query,
  params = [],
  enabled = true,
  refetchInterval
}: QueryOptions) => {
  return useQuery({
    queryKey: ["external-db", query, params],
    queryFn: async () => {
      console.log('Executing external database query:', query);

      const response = await apiClient.executeQuery<T>(query, params);

      if (response.status === 'error') {
        console.error('Error querying external database:', response.message);
        throw new Error(response.message || 'Failed to query external database');
      }

      console.log('Query result:', response.data);
      return (response.data || []) as T[];
    },
    enabled: enabled && !!query,
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval,
  });
};
