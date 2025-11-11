import { useExternalDatabase } from "@/hooks/useExternalDatabase";
import { Skeleton } from "@/components/ui/skeleton";

interface FactorRow {
  factor: string;
  securities_count: number;
  total_value: number;
  avg_value: number;
  percentage: number;
  new_book_gross: number;
  old_book_gross: number;
  delta: number;
}

export const FactorComparison = () => {
  // Query asset class distribution (similar to factor exposure)
  const { data: factorData, isLoading } = useExternalDatabase<FactorRow>({
    query: `
      WITH total_value AS (
        SELECT COALESCE(SUM(t.amount), 0) as total
        FROM collation_storage.transactions t
        WHERE t.amount > 0
      )
      SELECT
        COALESCE(s.asset_class, 'Unclassified') as factor,
        COUNT(DISTINCT s.id) as securities_count,
        COALESCE(SUM(t.amount), 0) as total_value,
        COALESCE(AVG(t.amount), 0) as avg_value,
        ROUND((COALESCE(SUM(t.amount), 0) / NULLIF((SELECT total FROM total_value), 0) * 100)::numeric, 2) as percentage,
        ROUND((COALESCE(SUM(t.amount), 0) / NULLIF((SELECT total FROM total_value), 0) * 100)::numeric, 2) as new_book_gross,
        ROUND((COALESCE(SUM(t.amount), 0) / NULLIF((SELECT total FROM total_value), 0) * 100)::numeric, 2) as old_book_gross,
        0 as delta
      FROM collation_storage.securities s
      LEFT JOIN collation_storage.transactions t ON s.id = t.security_id
      WHERE s.is_active = true
      GROUP BY s.asset_class
      ORDER BY total_value DESC
    `,
  });
  return (
    <div className="bg-card border border-border rounded">
      <div className="bg-table-header px-3 py-2 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Factor Comparison</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded">Loading</button>
          <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded">Crowding</button>
          <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded">Ownership</button>
          <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded">Allocation</button>
          <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded">Consensus</button>
          <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded">Macro</button>
          <button className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded">Other</button>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-table-header sticky top-0">
            <tr className="border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Asset Class</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Securities</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Total Value ($K)</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Avg Value ($K)</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">% of Portfolio</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Current % Book</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Previous % Book</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Delta</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="px-3 py-2" colSpan={8}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : factorData && factorData.length > 0 ? (
              factorData.map((row, idx) => {
                const getValueClass = (value: number) => {
                  if (value > 0) return "text-success";
                  if (value < 0) return "text-destructive";
                  return "text-foreground";
                };

                return (
                  <tr key={idx} className="border-b border-border bg-table-row hover:bg-table-hover">
                    <td className="px-3 py-2 text-foreground font-medium">{row.factor}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{row.securities_count}</td>
                    <td className="px-3 py-2 text-right text-foreground">
                      ${(Number(row.total_value) / 1000).toFixed(1)}
                    </td>
                    <td className="px-3 py-2 text-right text-foreground">
                      ${(Number(row.avg_value) / 1000).toFixed(1)}
                    </td>
                    <td className={`px-3 py-2 text-right ${getValueClass(Number(row.percentage))}`}>
                      {Number(row.percentage).toFixed(1)}%
                    </td>
                    <td className={`px-3 py-2 text-right ${getValueClass(Number(row.new_book_gross))}`}>
                      {Number(row.new_book_gross).toFixed(1)}%
                    </td>
                    <td className={`px-3 py-2 text-right ${getValueClass(Number(row.old_book_gross))}`}>
                      {Number(row.old_book_gross).toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-right text-muted-foreground">
                      {Number(row.delta).toFixed(2)}%
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">
                  No asset class data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
