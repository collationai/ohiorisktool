interface FactorRow {
  factor: string;
  new: number;
  oldLoading: number;
  newExpReturn: number;
  oldExpReturn: number;
  ownership: number;
  newBookGross: number;
  oldBookGross: number;
  delta: number;
  newEffective: number;
  oldEffective: number;
}

const factorData: FactorRow[] = [
  { factor: "Total", new: 0, oldLoading: 0, newExpReturn: 0, oldExpReturn: 0, ownership: 99.6, newBookGross: 2, oldBookGross: 0.0, delta: 0.0, newEffective: 831, oldEffective: 831 },
  { factor: "Rare Factor", new: 0, oldLoading: -6.43, newExpReturn: -0.43, oldExpReturn: 0, ownership: -18.1, newBookGross: -18.1, oldBookGross: 0.0, delta: 0.0, newEffective: -820, oldEffective: -820 },
  { factor: "Market", new: 0, oldLoading: -0.87, newExpReturn: -0.87, oldExpReturn: 0, ownership: 14.0, newBookGross: 14.0, oldBookGross: -0.01, delta: 0.0, newEffective: 56, oldEffective: 56 },
  { factor: "Style", new: 0, oldLoading: 0, newExpReturn: 0, oldExpReturn: 0, ownership: 5.7, newBookGross: 5.7, oldBookGross: 0.0, delta: 0.0, newEffective: -71, oldEffective: -71 },
  { factor: "Country Rare", new: 0, oldLoading: -137, newExpReturn: -137, oldExpReturn: 0, ownership: -0.7, newBookGross: -0.7, oldBookGross: 0.0, delta: 0.0, newEffective: -72, oldEffective: -72 },
  { factor: "Mkt Cap", new: 0, oldLoading: 0.21, newExpReturn: 0.21, oldExpReturn: 0, ownership: -0.1, newBookGross: -0.1, oldBookGross: 0.0, delta: 0.0, newEffective: 201, oldEffective: 201 },
  { factor: "Exchange Rate", new: 0, oldLoading: 0.10, newExpReturn: 0.10, oldExpReturn: 0, ownership: 0.1, newBookGross: 0.1, oldBookGross: -0.01, delta: 0.0, newEffective: 179, oldEffective: 179 },
  { factor: "Growth", new: 0, oldLoading: -1.82, newExpReturn: -1.02, oldExpReturn: 0, ownership: 0.0, newBookGross: 0.0, oldBookGross: 0.0, delta: 0.0, newEffective: -17, oldEffective: -17 },
  { factor: "Size", new: 0, oldLoading: -0.57, newExpReturn: -0.57, oldExpReturn: 0, ownership: 3.1, newBookGross: 3.1, oldBookGross: 0.0, delta: 0.0, newEffective: -530, oldEffective: -530 },
  { factor: "Dividend Yield", new: 0, oldLoading: 0.60, newExpReturn: 0.60, oldExpReturn: 0, ownership: 0.0, newBookGross: 0.0, oldBookGross: 0.0, delta: 0.0, newEffective: 50, oldEffective: 50 },
  { factor: "Momentum", new: 0, oldLoading: -0.14, newExpReturn: -0.14, oldExpReturn: 0, ownership: 0.6, newBookGross: 0.6, oldBookGross: 0.0, delta: 0.0, newEffective: 135, oldEffective: 135 },
  { factor: "Quality", new: 0, oldLoading: -3.13, newExpReturn: -3.13, oldExpReturn: 0, ownership: 0.4, newBookGross: 0.4, oldBookGross: 0.0, delta: 0.0, newEffective: -101, oldEffective: -101 },
  { factor: "Volatility", new: 0, oldLoading: 0.24, newExpReturn: 0.24, oldExpReturn: 0, ownership: -1.1, newBookGross: -1.1, oldBookGross: 0.0, delta: 0.0, newEffective: 239, oldEffective: 239 },
  { factor: "Earnings Yield", new: 0, oldLoading: 3.36, newExpReturn: 3.36, oldExpReturn: 0, ownership: 0.2, newBookGross: 0.2, oldBookGross: 0.0, delta: 0.0, newEffective: 167, oldEffective: 167 },
];

export const FactorComparison = () => {
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
              <th className="text-left px-3 py-2 font-medium text-muted-foreground">Factor</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">New</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Old Loading</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Delta</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">New % of Book</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Old % of Book</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Delta</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">New Exposure</th>
              <th className="text-right px-3 py-2 font-medium text-muted-foreground">Old Exposure</th>
            </tr>
          </thead>
          <tbody>
            {factorData.map((row, idx) => {
              const getValueClass = (value: number) => {
                if (value > 0) return "text-success";
                if (value < 0) return "text-destructive";
                return "text-foreground";
              };

              return (
                <tr key={idx} className="border-b border-border bg-table-row hover:bg-table-hover">
                  <td className="px-3 py-2 text-foreground font-medium">{row.factor}</td>
                  <td className="px-3 py-2 text-right text-muted-foreground">{row.new}</td>
                  <td className={`px-3 py-2 text-right ${getValueClass(row.oldLoading)}`}>
                    {row.oldLoading.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right bg-neutral/30 text-neutral-foreground">
                    {row.newExpReturn.toFixed(2)}
                  </td>
                  <td className={`px-3 py-2 text-right ${getValueClass(row.newBookGross)}`}>
                    {row.newBookGross.toFixed(1)}%
                  </td>
                  <td className={`px-3 py-2 text-right ${getValueClass(row.oldBookGross)}`}>
                    {row.oldBookGross.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {row.delta.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2 text-right text-foreground">{row.newEffective}</td>
                  <td className="px-3 py-2 text-right text-foreground">{row.oldEffective}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
