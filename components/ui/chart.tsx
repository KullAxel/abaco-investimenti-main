import React, { createContext, useContext, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Chart context for sharing configuration
interface ChartConfig {
  value?: {
    label: string;
    color: string;
  };
  [key: string]: any;
}

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChartContext() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within a ChartContainer");
  }
  return context;
}

interface ChartContainerProps {
  children: ReactNode;
  config: ChartConfig;
  className?: string;
}

export function ChartContainer({
  children,
  config,
  className,
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("w-full h-full", className)}>
        {children}
      </div>
    </ChartContext.Provider>
  );
}

interface ChartTooltipProps {
  children: ReactNode;
  className?: string;
}

export function ChartTooltip({ children, className }: ChartTooltipProps) {
  return (
    <div
      className={cn(
        "bg-background border rounded-md p-2 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ChartTooltipContentProps {
  value: number | string;
  label?: string;
  className?: string;
  formatter?: (value: number | string) => string;
}

export function ChartTooltipContent({
  value,
  label,
  className,
  formatter,
}: ChartTooltipContentProps) {
  const displayValue = formatter ? formatter(value) : value;
  
  return (
    <div className={cn("flex flex-col", className)}>
      {label && <p className="font-medium">{label}</p>}
      <p>{displayValue}</p>
    </div>
  );
} 