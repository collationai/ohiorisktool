interface DetailRow {
  label: string;
  old: string;
  new: string;
  delta: string;
}

const detailData: DetailRow[] = [
  { label: "% Idio (unhedged)", old: "1.4%", new: "1.4%", delta: "0.0%" },
  { label: "% SAS Industry || Book Val", old: "1.9%", new: "1.9%", delta: "0.0%" },
  { label: "Predicted Beta || $all", old: "0.5% | $473", new: "0.5% | $473", delta: "0.0% | $0" },
  { label: "Long || $all", old: "N/A | $0", new: "N/A | $0", delta: "N/A | $0" },
  { label: "Short || $all", old: "N/A | $0", new: "N/A | $0", delta: "N/A | $0" },
  { label: "Effective || Total Positions", old: "N/A | $0", new: "N/A | $0", delta: "N/A | $0" },
  { label: "Effective || Total Longs", old: "12.9 | $0", new: "12.9 | $0", delta: "0.0 | $0" },
  { label: "Effective || Total Shorts", old: "N/A | $0", new: "N/A | $0", delta: "N/A | $0" },
  { label: "PF Sharpe PV ($)", old: "0.72x", new: "0.72x", delta: "0.02x" },
];

export const PortfolioDetailCard = () => {
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
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium"></th>
              <th className="text-right py-2 text-muted-foreground font-medium">New</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Old</th>
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
