import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface QueryOptions {
  query: string;
  params?: any[];
  enabled?: boolean;
}

export const useExternalDatabase = <T = any>({ query, params, enabled = true }: QueryOptions) => {
  return useQuery({
    queryKey: ["external-db", query, params],
    queryFn: async () => {
      console.log('Executing external database query:', query);
      
      const { data, error } = await supabase.functions.invoke('query-external-db', {
        body: { query, params },
      });

      if (error) {
        console.error('Error querying external database:', error);
        throw new Error(error.message || 'Failed to query external database');
      }

      if (data.error) {
        console.error('Database query error:', data.error);
        throw new Error(data.error);
      }

      console.log('Query result:', data);
      return data.data as T[];
    },
    enabled,
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });
};
