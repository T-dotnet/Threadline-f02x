import { type LucideIcon } from "lucide-react";
import { Badge, type badgeVariants } from "../ui/Badge";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface IconBadgeProps {
  variant: BadgeVariant;
  icon: LucideIcon;
  label: string;
  showIcon?: boolean;
  className?: string;
}

export function IconBadge({ variant, icon: Icon, label, showIcon = true, className }: IconBadgeProps) {
  return (
    <Badge variant={variant} className={cn("gap-1.5 px-3 h-6", className)}>
      {showIcon && <Icon size={14} className="shrink-0" />}
      <span className="font-semibold tracking-tight">{label}</span>
    </Badge>
  );
}
