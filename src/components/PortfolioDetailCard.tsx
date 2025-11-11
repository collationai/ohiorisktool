import { useExternalDatabase } from "@/hooks/useExternalDatabase";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioStats {
  total_securities: number;
  total_transactions: number;
  total_value: number;
  active_portfolios: number;
  asset_classes: number;
  avg_security_value: number;
}

interface DetailRow {
  label: string;
  old: string;
  new: string;
  delta: string;
}

export const PortfolioDetailCard = () => {
  // Get portfolio statistics
  const { data: statsData, isLoading } = useExternalDatabase<PortfolioStats>({
    query: `
      SELECT
        COUNT(DISTINCT s.id) as total_securities,
        COUNT(DISTINCT t.id) as total_transactions,
        COALESCE(SUM(t.amount), 0) as total_value,
        COUNT(DISTINCT p.id) as active_portfolios,
        COUNT(DISTINCT s.asset_class) as asset_classes,
        COALESCE(AVG(t.amount), 0) as avg_security_value
      FROM collation_storage.securities s
      LEFT JOIN collation_storage.transactions t ON s.id = t.security_id
      LEFT JOIN collation_storage.portfolios p ON t.portfolio_id = p.id
      WHERE s.is_active = true
    `,
  });

  const stats = statsData?.[0];

  const detailData: DetailRow[] = [
    {
      label: "Total Securities",
      new: stats?.total_securities?.toString() || "0",
      old: stats?.total_securities?.toString() || "0",
      delta: "0"
    },
    {
      label: "Total Transactions",
      new: stats?.total_transactions?.toString() || "0",
      old: stats?.total_transactions?.toString() || "0",
      delta: "0"
    },
    {
      label: "Portfolio Value ($M)",
      new: `$${((stats?.total_value || 0) / 1000000).toFixed(2)}`,
      old: `$${((stats?.total_value || 0) / 1000000).toFixed(2)}`,
      delta: "$0"
    },
    {
      label: "Active Portfolios",
      new: stats?.active_portfolios?.toString() || "0",
      old: stats?.active_portfolios?.toString() || "0",
      delta: "0"
    },
    {
      label: "Asset Classes",
      new: stats?.asset_classes?.toString() || "0",
      old: stats?.asset_classes?.toString() || "0",
      delta: "0"
    },
    {
      label: "Avg Security Value ($K)",
      new: `$${((stats?.avg_security_value || 0) / 1000).toFixed(1)}`,
      old: `$${((stats?.avg_security_value || 0) / 1000).toFixed(1)}`,
      delta: "$0"
    },
  ];
  return (
    <div className="bg-card border border-border rounded">
      <div className="bg-table-header px-3 py-2 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Portfolio Comparison</h3>
        <div className="flex gap-2 mt-1">
          <span className="text-xs text-muted-foreground">% Gross</span>
          <span className="text-xs text-muted-foreground">% AUM</span>
        </div>
      </div>
      <div className="p-3">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium"></th>
                <th className="text-right py-2 text-muted-foreground font-medium">Current</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Previous</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Delta</th>
              </tr>
            </thead>
            <tbody>
              {detailData.map((row, idx) => (
                <tr key={idx} className="border-b border-border/50">
                  <td className="py-2 text-foreground">{row.label}</td>
                  <td className="py-2 text-right text-foreground">{row.new}</td>
                  <td className="py-2 text-right text-foreground">{row.old}</td>
                  <td className="py-2 text-right text-muted-foreground">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between bg-primary/20 px-2 py-1.5 rounded">
            <span className="text-foreground font-medium">iShares Barclays 20+ Year Treasury</span>
            <span className="text-primary font-medium">12.0% | 0.8%</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">New | BAM | %</span>
              <span className="text-foreground">$913 | 98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross | BAM</span>
              <span className="text-foreground">$913 | 98%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Short | %</span>
              <span className="text-foreground">$0 | 0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective | Total Positions</span>
              <span className="text-foreground">$0 | 0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective | Total Longs</span>
              <span className="text-foreground">12.0% | 0.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Top 10 % Total Variance</span>
              <span className="text-foreground">73.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Top 5 % Total Variance</span>
              <span className="text-foreground">73.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Portfolio HH</span>
              <span className="text-foreground">N/A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
