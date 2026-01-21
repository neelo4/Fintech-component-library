import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "neutral";
  size?: "xs" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  title?: string;
  "aria-label"?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  title,
  "aria-label": ariaLabel,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

  const variantClasses: Record<string, string> = {
    primary: "bg-primary hover:bg-primary/90 text-white focus:ring-primary",
    secondary:
      "bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary",
    success: "bg-success hover:bg-success/90 text-white focus:ring-success",
    danger: "bg-danger hover:bg-danger/90 text-white focus:ring-danger",
    neutral: "bg-neutral hover:bg-neutral/80 text-slate-900 focus:ring-neutral",
  };

  const sizeClasses: Record<string, string> = {
    xs: "px-3 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = [
    baseClasses,
    variantClasses[variant] ?? variantClasses.primary,
    sizeClasses[size] ?? sizeClasses.md,
    disabled && "opacity-50 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.displayName = "Button";
