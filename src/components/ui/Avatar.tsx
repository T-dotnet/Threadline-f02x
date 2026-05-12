import * as React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-[10px]",
      md: "h-10 w-10 text-xs",
      lg: "h-12 w-12 text-sm",
      xl: "h-16 w-16 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-slate-100",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-medium text-slate-500 uppercase">
            {fallback || alt?.charAt(0) || "U"}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
