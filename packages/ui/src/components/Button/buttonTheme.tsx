import * as React from "react";

export type ButtonVariantName = string;
export type ButtonSizeName = string;

export interface ButtonTheme {
  baseClasses: string;
  variants: Record<ButtonVariantName, string>;
  sizes: Record<ButtonSizeName, string>;
  focusRing?: string;
}

export interface ButtonThemeConfig {
  baseClasses?: string;
  variants?: Record<ButtonVariantName, string>;
  sizes?: Record<ButtonSizeName, string>;
  focusRing?: string;
}

export const defaultButtonTheme: ButtonTheme = {
  baseClasses:
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 gap-2",
  focusRing: "focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    primary: "bg-primary hover:bg-primary/90 text-white focus:ring-primary",
    secondary:
      "bg-secondary hover:bg-secondary/90 text-white focus:ring-secondary",
    success: "bg-success hover:bg-success/90 text-white focus:ring-success",
    danger: "bg-danger hover:bg-danger/90 text-white focus:ring-danger",
    neutral: "bg-neutral hover:bg-neutral/80 text-slate-900 focus:ring-neutral",
  },
  sizes: {
    xs: "px-3 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  },
};

const ButtonThemeContext =
  React.createContext<ButtonTheme>(defaultButtonTheme);

export const useButtonTheme = () => React.useContext(ButtonThemeContext);

export const ButtonThemeProvider: React.FC<
  React.PropsWithChildren<{ value?: ButtonThemeConfig }>
> = ({ value, children }) => {
  const memoizedTheme = React.useMemo<ButtonTheme>(() => {
    if (!value) {
      return defaultButtonTheme;
    }

    return {
      baseClasses: value.baseClasses ?? defaultButtonTheme.baseClasses,
      focusRing: value.focusRing ?? defaultButtonTheme.focusRing,
      variants: {
        ...defaultButtonTheme.variants,
        ...value.variants,
      },
      sizes: {
        ...defaultButtonTheme.sizes,
        ...value.sizes,
      },
    };
  }, [value]);

  return (
    <ButtonThemeContext.Provider value={memoizedTheme}>
      {children}
    </ButtonThemeContext.Provider>
  );
};
