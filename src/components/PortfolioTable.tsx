import { useState } from "react";

interface PortfolioRow {
  name: string;
  ticker: string;
  total: number;
  newNetInvested: number;
  oldNetInvested: number;
  delta: number;
  bookGross: number;
  bookDelta: number;
  newEffectiveExposure: number;
  oldEffectiveExposure: number;
  deltaPct: number;
}

const portfolioData: PortfolioRow[] = [
  { name: "HFR Hedge Fund", ticker: "HFRCW-HF", total: 10.8, newNetInvested: 10.8, oldNetInvested: 0, delta: 0, bookGross: 11.3, bookDelta: 0.0, newEffectiveExposure: 374433, oldEffectiveExposure: 374433, deltaPct: 0 },
  { name: "Direxion Balanced Portfo S-1", ticker: "DBAP", total: 68.9, newNetInvested: 68.9, oldNetInvested: 0, delta: 0, bookGross: 3.8, bookDelta: 0.0, newEffectiveExposure: 706650, oldEffectiveExposure: 706650, deltaPct: 0 },
  { name: "SPDR Gold Trust", ticker: "GLD", total: 44.1, newNetInvested: 44.1, oldNetInvested: 0, delta: 0, bookGross: 1.3, bookDelta: 0.0, newEffectiveExposure: 544010, oldEffectiveExposure: 544010, deltaPct: 0 },
  { name: "Direxion MSCI EAFE Portf", ticker: "EFO", total: 47.0, newNetInvested: 47.0, oldNetInvested: 0, delta: 0, bookGross: 4.3, bookDelta: 0.0, newEffectiveExposure: 413337, oldEffectiveExposure: 413337, deltaPct: 0 },
  { name: "Direxion Small Cap Portf", ticker: "SMCP", total: 24.0, newNetInvested: 24.0, oldNetInvested: 0, delta: 0, bookGross: 1.1, bookDelta: 0.0, newEffectiveExposure: 272453, oldEffectiveExposure: 272453, deltaPct: 0 },
  { name: "Direxion MSCI Emerging P", ticker: "EEM", total: 46.0, newNetInvested: 46.0, oldNetInvested: 0, delta: 0, bookGross: 3.0, bookDelta: 0.0, newEffectiveExposure: 890141, oldEffectiveExposure: 890141, deltaPct: 0 },
  { name: "SPDR Portfolio S&P 500", ticker: "SPLG", total: 44.8, newNetInvested: 44.8, oldNetInvested: 0, delta: 0, bookGross: 1.6, bookDelta: 0.0, newEffectiveExposure: 435669, oldEffectiveExposure: 435669, deltaPct: 0 },
  { name: "Anthem International M", ticker: "ARTMX", total: 43.8, newNetInvested: 43.8, oldNetInvested: 0, delta: 0, bookGross: 4.7, bookDelta: 0.0, newEffectiveExposure: 810324, oldEffectiveExposure: 810324, deltaPct: 0 },
  { name: "Direxion Core Equity M", ticker: "DCEM", total: 41.4, newNetInvested: 41.4, oldNetInvested: 0, delta: 0, bookGross: 4.2, bookDelta: 0.0, newEffectiveExposure: 608726, oldEffectiveExposure: 608726, deltaPct: 0 },
  { name: "Direxion MSCI EAFE ETF", ticker: "EFAV", total: 34.3, newNetInvested: 34.3, oldNetInvested: 0, delta: 0, bookGross: 3.7, bookDelta: 0.0, newEffectiveExposure: 367709, oldEffectiveExposure: 367709, deltaPct: 0 },
  { name: "iShares Global 3000", ticker: "IOO", total: 33.8, newNetInvested: 33.8, oldNetInvested: 0, delta: 0, bookGross: 3.3, bookDelta: 0.0, newEffectiveExposure: 357703, oldEffectiveExposure: 357703, deltaPct: 0 },
  { name: "Vanguard Russell 100", ticker: "VONE", total: 26.3, newNetInvested: 26.3, oldNetInvested: 0, delta: 0, bookGross: 2.8, bookDelta: 0.0, newEffectiveExposure: 86607, oldEffectiveExposure: 86607, deltaPct: 0 },
  { name: "iShares MSCI Total Intl", ticker: "SHV", total: 24.3, newNetInvested: 24.3, oldNetInvested: 0, delta: 0, bookGross: 2.6, bookDelta: 0.0, newEffectiveExposure: 209905, oldEffectiveExposure: 209905, deltaPct: 0 },
  { name: "Cuna USD", ticker: "USDCASH", total: 21.1, newNetInvested: 21.1, oldNetInvested: 0, delta: 0, bookGross: 2.3, bookDelta: 0.0, newEffectiveExposure: 0, oldEffectiveExposure: 0, deltaPct: 0 },
];

export const PortfolioTable = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(6);

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
            {portfolioData.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => setSelectedRow(idx)}
                className={`border-b border-border cursor-pointer ${
                  selectedRow === idx ? "bg-table-selected" : "bg-table-row hover:bg-table-hover"
                }`}
              >
                <td className="px-3 py-2 text-foreground font-medium">{row.name}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.ticker}</td>
                <td className="px-3 py-2 text-right text-foreground">{row.newNetInvested.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-foreground">{row.oldNetInvested.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.delta.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-foreground">{row.bookGross.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right text-foreground">{row.bookDelta.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.deltaPct.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right text-foreground">{row.newEffectiveExposure.toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-foreground">{row.oldEffectiveExposure.toLocaleString()}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{row.deltaPct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
