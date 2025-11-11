import { PortfolioTable } from "@/components/PortfolioTable";
import { PortfolioDetailCard } from "@/components/PortfolioDetailCard";
import { FactorComparison } from "@/components/FactorComparison";
import { BacktestChart } from "@/components/BacktestChart";
import { DatabaseConnectionStatus } from "@/components/DatabaseConnectionStatus";
import { CollapsibleSidebar } from "@/components/CollapsibleSidebar";
import { useState } from "react";

const Index = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Collapsible Sidebar with Database Connection Status */}
      <CollapsibleSidebar onExpandChange={setIsSidebarExpanded}>
        <DatabaseConnectionStatus />
      </CollapsibleSidebar>

      {/* Main Content Area - Shifts based on sidebar state */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "ml-96" : "ml-16"
        } p-4`}
      >
        <header className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">Portfolio Comparison</h1>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded">New</button>
              <select className="bg-secondary text-xs px-3 py-1.5 rounded border border-border text-foreground">
                <option>Settings</option>
              </select>
              <select className="bg-secondary text-xs px-3 py-1.5 rounded border border-border text-foreground">
                <option>Opt</option>
              </select>
              <select className="bg-secondary text-xs px-3 py-1.5 rounded border border-border text-foreground">
                <option>Settings</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded border border-border">
              Select Benchmark
            </button>
            <button className="px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded border border-border">
              Save as New Portfolio
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <PortfolioTable />
          </div>
          <div>
            <PortfolioDetailCard />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FactorComparison />
          </div>
          <div>
            <BacktestChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
