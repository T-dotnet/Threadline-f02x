import React from 'react';
import { Typography, Card, CardContent, DataPoint } from '../../components/ui';
import { cn } from '../../lib/utils';

export interface EntityCardProps {
  key?: React.Key;
  title: React.ReactNode;
  titleClassName?: string;
  statusBadge?: React.ReactNode;
  metadata?: { label: string; value: React.ReactNode }[];
  summary?: React.ReactNode;
  rightAction?: React.ReactNode;
  onClick?: () => void;
  children?: React.ReactNode;
  hoverable?: boolean;
}

export const EntityCard = React.memo(({
  title,
  titleClassName,
  statusBadge,
  metadata = [],
  summary,
  rightAction,
  onClick,
  children,
  hoverable = true,
}: EntityCardProps) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <Card 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group transition-all duration-300 border-divider",
        hoverable && onClick ? "cursor-pointer hover:border-primary/50 hover:shadow-md" : "cursor-default",
        isHovered && hoverable && onClick ? "border-primary/50" : ""
      )}
    >
      <CardContent className="p-6 md:p-7 flex flex-col">
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              {statusBadge && <div className="mb-1">{statusBadge}</div>}
              <Typography 
                variant="h3" 
                className={cn(
                  "m-0 tracking-tight transition-colors", 
                  onClick ? "group-hover:text-primary" : "text-text-primary",
                  titleClassName
                )}
              >
                {title}
              </Typography>
            </div>
            
            {metadata.length > 0 && (
              <div className="flex items-start gap-8 flex-wrap">
                {metadata.map((m, i) => (
                  <DataPoint key={i} label={m.label} value={m.value} />
                ))}
              </div>
            )}
            
            {summary && (
              <Typography variant="body-sm" className="text-text-secondary leading-relaxed">
                {summary}
              </Typography>
            )}
          </div>
          
          {rightAction && (
            <div className="flex items-center gap-3 shrink-0">
              {rightAction}
            </div>
          )}
        </div>
        {children && <div className="mt-6 pt-6 border-t border-divider">{children}</div>}
      </CardContent>
    </Card>
  );
});

EntityCard.displayName = "EntityCard";
