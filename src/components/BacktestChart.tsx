import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const generateData = () => {
  const data = [];
  let value = 1000;
  const startDate = new Date("2024-08-11");
  
  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    value = value * (1 + (Math.random() - 0.35) * 0.05);
    data.push({
      date: date.toISOString().split("T")[0],
      value: value,
      return: ((value - 1000) / 1000) * 100,
    });
  }
  return data;
};

const data = generateData();

export const BacktestChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("YTD");
  
  const periods = ["1D", "1W", "1M", "3M", "MTD", "QTD", "YTD", "1Y"];
  
  const currentReturn = data[data.length - 1].return;
  const returnColor = currentReturn >= 0 ? "#5a8a5a" : "#a55a5a";

  return (
    <div className="bg-card border border-border rounded">
      <div className="bg-table-header px-3 py-2 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Backtest</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Time Series</span>
            <span className="text-xs text-muted-foreground">Scatterplot</span>
            <span className="text-xs text-destructive">5 YTD As of 08/11/25</span>
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
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">08/11/2024</div>
            <div className="text-sm text-muted-foreground">08/11/2025</div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs text-muted-foreground mr-2">S&P 500 - Total Returns</span>
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
          <LineChart data={data}>
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
              tickFormatter={(value) => `${((value - 1000) / 10).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "4px",
              }}
              labelStyle={{ color: "#999" }}
              formatter={(value: number) => [
                `${((value - 1000) / 1000 * 100).toFixed(2)}%`,
                "Return",
              ]}
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
      </div>
    </div>
  );
};
