import * as React from "react";
import { useButtonTheme } from "./buttonTheme";

type ElementType = keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>;

type PolymorphicProps<C extends ElementType> = {
  as?: C;
};

type ButtonOwnProps = {
  children?: React.ReactNode;
  variant?: string;
  size?: string;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  fullWidth?: boolean;
};

export type ButtonProps<C extends ElementType = "button"> = ButtonOwnProps &
  PolymorphicProps<C> &
  Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonOwnProps | "as">;

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    viewBox="0 0 24 24"
    role="presentation"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export const Button = React.forwardRef(
  <C extends ElementType = "button">(
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      className = "",
      type = "button",
      iconLeft,
      iconRight,
      isLoading = false,
      loadingText,
      fullWidth = false,
      as,
      ...rest
    }: ButtonProps<C>,
    ref: React.Ref<Element>
  ) => {
    const Component = (as || "button") as ElementType;
    const theme = useButtonTheme();
    const variantClasses =
      theme.variants[variant] ?? theme.variants.primary ?? "";
    const sizeClasses = theme.sizes[size] ?? theme.sizes.md ?? "";
    const focusRing = theme.focusRing ?? "";
    const isDisabled = disabled || isLoading;
    const isButtonElement = Component === "button" || !as;

    const classes = cx(
      theme.baseClasses,
      focusRing,
      variantClasses,
      sizeClasses,
      fullWidth && "w-full",
      isDisabled && "opacity-50 cursor-not-allowed",
      className
    );

    const loadingLabel =
      loadingText ?? (typeof children === "string" ? children : "Loading...");

    const renderContent = () => {
      if (isLoading) {
        return (
          <span className="inline-flex items-center gap-2">
            <Spinner />
            {loadingLabel && <span>{loadingLabel}</span>}
          </span>
        );
      }

      return (
        <>
          {iconLeft && <span className="inline-flex items-center">{iconLeft}</span>}
          {children && <span>{children}</span>}
          {iconRight && (
            <span className="inline-flex items-center">{iconRight}</span>
          )}
        </>
      );
    };

    const sharedProps = {
      className: classes,
      "aria-busy": isLoading || undefined,
      "aria-disabled": !isButtonElement && isDisabled ? true : undefined,
      ...rest,
    } as React.ComponentPropsWithoutRef<C>;

    if (isButtonElement) {
      return (
        <button
          type={type}
          disabled={isDisabled}
          ref={ref as React.Ref<HTMLButtonElement>}
          {...(sharedProps as React.ComponentPropsWithoutRef<"button">)}
        >
          {renderContent()}
        </button>
      );
    }

    const elementProps = {
      role: sharedProps.role ?? "button",
      tabIndex: (sharedProps as any).tabIndex ?? 0,
      onClick: isDisabled ? undefined : sharedProps.onClick,
      ...sharedProps,
    } as React.ComponentPropsWithoutRef<C>;

    return (
      <Component ref={ref} {...elementProps}>
        {renderContent()}
      </Component>
    );
  }
) as <C extends ElementType = "button">(
  props: ButtonProps<C> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

Button.displayName = "Button";
