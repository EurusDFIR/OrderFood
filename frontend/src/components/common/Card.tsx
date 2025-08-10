import React from "react";
import { cn } from "@/utils/helpers";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  header,
  footer,
}) => {
  return (
    <div className={cn("card", hover && "card-hover", className)}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};
