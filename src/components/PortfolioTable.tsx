import { useState } from "react";
import { useExternalDatabase } from "@/hooks/useExternalDatabase";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioRow {
  name: string;
  ticker: string;
  total: number;
  new_net_invested: number;
  old_net_invested: number;
  delta: number;
  book_gross: number;
  book_delta: number;
  new_effective_exposure: number;
  old_effective_exposure: number;
  delta_pct: number;
}

export const PortfolioTable = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(6);
  
  // Query your PostgreSQL database from collation_storage schema
  // Aggregate securities with their transaction data to build portfolio holdings
  const { data: portfolioData, isLoading, error } = useExternalDatabase<PortfolioRow>({
    query: `
      SELECT
        s.name,
        COALESCE(s.ticker, 'N/A') as ticker,
        COALESCE(SUM(t.amount), 0) as total,
        COALESCE(SUM(CASE WHEN t.transaction_date >= CURRENT_DATE - INTERVAL '30 days' THEN t.amount ELSE 0 END), 0) as new_net_invested,
        COALESCE(SUM(CASE WHEN t.transaction_date < CURRENT_DATE - INTERVAL '30 days' THEN t.amount ELSE 0 END), 0) as old_net_invested,
        COALESCE(SUM(CASE WHEN t.transaction_date >= CURRENT_DATE - INTERVAL '30 days' THEN t.amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN t.transaction_date < CURRENT_DATE - INTERVAL '30 days' THEN t.amount ELSE 0 END), 0) as delta,
        ROUND((COALESCE(SUM(t.amount), 0) / NULLIF((SELECT SUM(amount) FROM collation_storage.transactions WHERE amount > 0), 0) * 100)::numeric, 2) as book_gross,
        0 as book_delta,
        COALESCE(SUM(t.amount * t.quantity), 0) as new_effective_exposure,
        COALESCE(SUM(t.amount * t.quantity), 0) as old_effective_exposure,
        0 as delta_pct
      FROM collation_storage.securities s
      LEFT JOIN collation_storage.transactions t ON s.id = t.security_id
      WHERE s.is_active = true
      GROUP BY s.id, s.name, s.ticker
      HAVING SUM(t.amount) IS NOT NULL
      ORDER BY total DESC
      LIMIT 20
    `,
  });

  if (error) {
    return (
      <div className="bg-card border border-border rounded p-4">
        <div className="text-destructive">Error loading portfolio data: {error.message}</div>
        <p className="text-xs text-muted-foreground mt-2">
          Make sure your database has a table named 'portfolio_holdings' with the required columns.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded">
      <div className="bg-table-header px-3 py-2 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Portfolio Comparison</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">% Gross</span>
          <span className="text-xs text-muted-foreground">% AUM</span>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-table-header sticky top-0">
            <tr className="border-b border-border">
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Name</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Ticker</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">New Net Invested (Mn)</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Old Net Invested (Mn)</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Delta</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">New % of Book Gross</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Old % of Book Gross</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Delta</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">New Effective Exposure</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Old Effective Exposure</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Delta</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="px-3 py-2" colSpan={11}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))
            ) : portfolioData && portfolioData.length > 0 ? (
              portfolioData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedRow(idx)}
                  className={`border-b border-border cursor-pointer ${
                    selectedRow === idx ? "bg-table-selected" : "bg-table-row hover:bg-table-hover"
                  }`}
                >
                  <td className="px-3 py-2 text-foreground font-medium">{row.name}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{row.ticker}</td>
                  <td className="px-3 py-2 text-right text-foreground">{Number(row.new_net_invested).toFixed(1)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{Number(row.old_net_invested).toFixed(1)}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{Number(row.delta).toFixed(1)}</td>
                  <td className="px-3 py-2 text-right text-foreground">{Number(row.book_gross).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right text-foreground">{Number(row.book_delta).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{Number(row.delta_pct).toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right text-foreground">{Number(row.new_effective_exposure).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-foreground">{Number(row.old_effective_exposure).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{row.delta_pct}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="px-3 py-4 text-center text-muted-foreground">
                  No portfolio data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
