import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children?: React.ReactNode;
}

export function Accordion({
  type = "single",
  collapsible = false,
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
  );

  const handleItemClick = React.useCallback((itemValue: string) => {
    setOpenItems((prev) => {
      if (type === "single") {
        return prev.includes(itemValue) && collapsible ? [] : [itemValue];
      } else {
        return prev.includes(itemValue)
          ? prev.filter((v) => v !== itemValue)
          : [...prev, itemValue];
      }
    });
    
    if (onValueChange) {
      if (type === "single") {
        onValueChange(collapsible && openItems.includes(itemValue) ? "" : itemValue);
      } else {
        onValueChange(
          openItems.includes(itemValue)
            ? openItems.filter((v) => v !== itemValue)
            : [...openItems, itemValue]
        );
      }
    }
  }, [type, collapsible, openItems, onValueChange]);

  // If controlled component
  React.useEffect(() => {
    if (value !== undefined) {
      setOpenItems(Array.isArray(value) ? value : value ? [value] : []);
    }
  }, [value]);

  return (
    <div className={cn("space-y-1", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<AccordionItemProps>, {
            openItems,
            onItemClick: handleItemClick,
          });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionItemProps {
  value: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  openItems?: string[];
  onItemClick?: (value: string) => void;
}

export function AccordionItem({
  value,
  trigger,
  children,
  className,
  openItems = [],
  onItemClick,
  ...props
}: AccordionItemProps) {
  const isOpen = openItems.includes(value);
  
  const handleClick = () => {
    if (onItemClick) {
      onItemClick(value);
    }
  };

  return (
    <div className={cn("border-b border-border last:border-0", className)} {...props}>
      <div
        onClick={handleClick}
        className={cn(
          "flex justify-between items-center py-3 px-2 cursor-pointer rounded-md hover:bg-accent",
          { "bg-accent": isOpen }
        )}
      >
        {trigger}
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", {
            "transform rotate-180": isOpen,
          })}
        />
      </div>
      {isOpen && (
        <div className="overflow-hidden text-sm py-2 px-2 transition-all">
          {children}
        </div>
      )}
    </div>
  );
} 