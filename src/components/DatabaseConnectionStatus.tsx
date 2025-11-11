import { useState, useEffect } from "react";
import { useHealthCheck, useTables } from "@/hooks/useDatabase";
import { apiClient } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, CheckCircle2, XCircle, Clock, Server } from "lucide-react";

interface TableStats {
  table_name: string;
  row_count: number;
  last_fetched: Date;
  status: 'loading' | 'success' | 'error';
}

export const DatabaseConnectionStatus = () => {
  const { data: healthData, isLoading: healthLoading, refetch: refetchHealth } = useHealthCheck();
  const { data: tablesData, isLoading: tablesLoading } = useTables();
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch row counts for main tables
  useEffect(() => {
    const fetchTableStats = async () => {
      const mainTables = ['securities', 'transactions', 'security_prices', 'portfolios', 'fund_managers'];
      const stats: TableStats[] = [];

      for (const tableName of mainTables) {
        try {
          const response = await apiClient.executeQuery(
            `SELECT COUNT(*) as count FROM collation_storage.${tableName}`
          );

          stats.push({
            table_name: tableName,
            row_count: parseInt(response.data?.[0]?.count || '0'),
            last_fetched: new Date(),
            status: 'success'
          });
        } catch (error) {
          stats.push({
            table_name: tableName,
            row_count: 0,
            last_fetched: new Date(),
            status: 'error'
          });
        }
      }

      setTableStats(stats);
      setLastRefresh(new Date());
    };

    fetchTableStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchTableStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchHealth();
    // Trigger stats refresh
    setLastRefresh(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const isConnected = healthData?.status === 'ok';
  const totalTables = tablesData?.tables?.length || 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <Card className="bg-card border border-border rounded p-4">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Live Database Connection</h2>
        </div>
        <Button
          onClick={handleRefresh}
          size="sm"
          variant="outline"
          disabled={isRefreshing}
          className="gap-2 w-full"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Connection
        </Button>
      </div>

      {/* Connection Status */}
      <div className="space-y-3 mb-4 p-3 bg-secondary/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
            <span className="font-medium text-foreground">
              {healthLoading ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Server className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">Database Host</div>
              <div className="font-mono text-xs text-foreground break-all">vibe-coding.postgres.database.azure.com</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-1">Database Name</div>
              <div className="font-mono text-xs text-foreground">atlantis</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <span className="text-muted-foreground">Last Refresh: </span>
            <span className="font-medium text-foreground">{formatTime(lastRefresh)}</span>
            <span className="text-muted-foreground ml-2">({formatTimeAgo(lastRefresh)})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className="text-muted-foreground">Schema: </div>
          <span className="font-mono text-xs bg-primary/10 px-2 py-1 rounded text-primary">
            collation_storage
          </span>
          <div className="text-muted-foreground ml-2">
            Total Tables: <span className="font-semibold text-foreground">{totalTables}</span>
          </div>
        </div>
      </div>

      {/* Active Tables Being Read */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
          Active Data Tables
        </h3>
        <div className="space-y-2">
          {tableStats.map((table) => (
            <div
              key={table.table_name}
              className="flex items-center justify-between p-2 bg-secondary/10 rounded border border-border/50 hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  table.status === 'success' ? 'bg-success' :
                  table.status === 'error' ? 'bg-destructive' : 'bg-muted'
                }`}></div>
                <span className="font-mono text-sm text-foreground">{table.table_name}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <div className="font-semibold text-primary">{table.row_count.toLocaleString()} rows</div>
                  <div className="text-muted-foreground">
                    Updated {formatTimeAgo(table.last_fetched)}
                  </div>
                </div>
                {table.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : table.status === 'error' ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span>Real-time connection to Azure PostgreSQL</span>
        </div>
      </div>
    </Card>
  );
};
