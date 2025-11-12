import * as React from "react";
import { cn } from "../../lib/util"; // optional helper for classNames

export const Tabs = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
};

export const TabsList = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex border-b border-muted", className)} {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
};
