import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";
import { useExternalDatabase } from "@/hooks/useExternalDatabase";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceData {
  price_date: string;
  avg_price: number;
  value: number;
  return: number;
}

export const BacktestChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("YTD");

  // Fetch historical price data from security_prices table
  const { data: priceData, isLoading } = useExternalDatabase<PriceData>({
    query: `
      SELECT
        price_date::text,
        AVG(price::numeric) as avg_price
      FROM collation_storage.security_prices
      WHERE price IS NOT NULL
      GROUP BY price_date
      ORDER BY price_date ASC
    `,
  });

  // Transform data for the chart
  const chartData = useMemo(() => {
    if (!priceData || priceData.length === 0) return [];

    const initialValue = Number(priceData[0]?.avg_price || 1000);

    return priceData.map((item) => {
      const value = Number(item.avg_price);
      const returnPct = ((value - initialValue) / initialValue) * 100;

      return {
        date: item.price_date,
        value: value,
        return: returnPct,
      };
    });
  }, [priceData]);
  
  const periods = ["1D", "1W", "1M", "3M", "MTD", "QTD", "YTD", "1Y"];

  const currentReturn = chartData.length > 0 ? chartData[chartData.length - 1].return : 0;
  const returnColor = currentReturn >= 0 ? "#5a8a5a" : "#a55a5a";

  const startDate = chartData.length > 0 ? new Date(chartData[0].date).toLocaleDateString() : "N/A";
  const endDate = chartData.length > 0 ? new Date(chartData[chartData.length - 1].date).toLocaleDateString() : "N/A";

  return (
    <div className="bg-card border border-border rounded">
      <div className="bg-table-header px-3 py-2 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Historical Performance</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Time Series</span>
            <span className="text-xs text-muted-foreground">Portfolio Value</span>
            {chartData.length > 0 && (
              <span className="text-xs text-destructive">
                {chartData.length} price points
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-2 py-1 text-xs rounded ${
                selectedPeriod === period
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No historical price data available
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">{startDate}</div>
                <div className="text-sm text-muted-foreground">{endDate}</div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs text-muted-foreground mr-2">Average Price - Returns</span>
                  <span className="text-sm font-semibold" style={{ color: returnColor }}>
                    {currentReturn >= 0 ? "+" : ""}{currentReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Daily</span>
                  <select className="bg-secondary text-xs px-2 py-1 rounded border border-border">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                  <select className="bg-secondary text-xs px-2 py-1 rounded border border-border">
                    <option>Returns</option>
                    <option>Cumulative</option>
                  </select>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              tick={{ fill: "#999", fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: "#999", fontSize: 10 }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
              labelStyle={{ color: "#999" }}
              formatter={(value: number, name: string) => {
                if (name === "value") {
                  return [`$${value.toFixed(2)}`, "Price"];
                }
                return [value.toFixed(2), name];
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4a90e2"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};
