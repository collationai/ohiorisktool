import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  onExpandChange?: (expanded: boolean) => void;
}

export const CollapsibleSidebar = ({ children, onExpandChange }: CollapsibleSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out z-40 ${
          isExpanded ? "w-96" : "w-16"
        } shadow-xl`}
      >
        {/* Collapsed State - Icon Only */}
        {!isExpanded && (
          <div className="flex flex-col items-center justify-start pt-20 gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="text-xs text-center text-muted-foreground transform -rotate-90 whitespace-nowrap">
              Database
            </div>
          </div>
        )}

        {/* Expanded State - Full Content */}
        {isExpanded && (
          <div className="h-full overflow-y-auto p-4 pt-14">
            {children}
          </div>
        )}

        {/* Toggle Button - Inside Sidebar at Top */}
        <div className="absolute top-0 left-0 right-0 p-2 bg-card border-b border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground px-2">
            {isExpanded ? "Connection Panel" : ""}
          </span>
          <Button
            onClick={handleToggle}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
