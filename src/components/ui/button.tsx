import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md cursor-pointer",
          "font-medium transition-colors focus-visible:outline-none focus-visible:ring-1",
          "focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[var(--primary)] text-[var(--foreground)] shadow hover:bg-[var(--primary)]/90":
              variant === "default",
            "bg-[var(--destructive)] text-[var(--foreground)] shadow-sm hover:bg-[var(--destructive)]/90":
              variant === "destructive",
            "border border-[var(--input)] bg-[var(--card)] shadow-sm hover:bg-[var(--accent)] hover:text-[var(--foreground)]":
              variant === "outline",
            "bg-[var(--secondary)] text-[var(--foreground)] shadow-sm hover:bg-[var(--secondary)]/80":
              variant === "secondary",
            "hover:bg-[var(--accent)] hover:text-[var(--foreground)]": variant === "ghost",
            "text-[var(--primary)] underline-offset-4 hover:underline":
              variant === "link",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
