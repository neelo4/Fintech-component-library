import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible content (preferred) */
  children?: React.ReactNode;

  /** Optional label (useful for Storybook & icon-only buttons) */
  label?: string;

  /** Visual style */
  variant?: "primary" | "secondary" | "success" | "danger" | "neutral";

  /** Size of the button */
  size?: "xs" | "sm" | "md" | "lg";
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({
  children,
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  ...rest
}, ref) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "transition-colors duration-200";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus-visible:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500",
    neutral:
      "bg-slate-200 hover:bg-slate-300 text-slate-900 focus-visible:ring-slate-400",
  };

  const sizeClasses = {
    xs: "px-3 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className,
  ].join(" ");

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      {...rest}
