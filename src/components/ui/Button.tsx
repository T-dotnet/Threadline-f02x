import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'brand' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, iconRight, children, ...props }, ref) => {
    const variants = {
      primary: "bg-gray-900 text-white hover:bg-gray-800 shadow-sm transition-all active:scale-95",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",
      brand: "bg-primary text-white hover:opacity-90 shadow-sm transition-all active:scale-95",
      danger: "bg-error text-white hover:bg-error/90 shadow-sm transition-all active:scale-95",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-md",
      md: "px-4 py-2 text-sm rounded-lg",
      lg: "px-6 py-3 text-base rounded-lg",
      icon: "p-2 rounded-full",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
           <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
            {iconRight && <span className="shrink-0">{iconRight}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
