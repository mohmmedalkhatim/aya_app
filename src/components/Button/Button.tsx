import React, { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const baseStyles =
  "inline-flex items-center justify-center rounded font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus-visible:ring-sky-500",
  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 focus-visible:ring-gray-400",
  ghost:
    "bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-300",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          "relative",
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* Content */}
        <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
          {children}
        </span>

        {/* Loader overlay (prevents layout shift) */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}