import React, { JSX } from 'react';

/* ───────────────────────────── Types ───────────────────────────── */

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;   // semantic level (h1–h6)
  size?: HeadingSize;     // visual size
  weight?: HeadingWeight;
  muted?: boolean;
  align?: 'left' | 'center' | 'right';
}

/* ───────────────────────────── Styles ───────────────────────────── */

const SIZE_CLASSES: Record<HeadingSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl'
};

const WEIGHT_CLASSES: Record<HeadingWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};

const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
} as const;

/* ───────────────────────────── Component ───────────────────────────── */

export function Heading({
  level = 2,
  size = 'lg',
  weight = 'semibold',
  muted = false,
  align = 'left',
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = (`h${level}` as keyof JSX.IntrinsicElements) as React.ElementType;

  return (
    <Tag
      className={`
        ${SIZE_CLASSES[size]}
        ${WEIGHT_CLASSES[weight]}
        ${ALIGN_CLASSES[align]}
        ${muted ? 'text-gray-500' : 'text-gray-900'}
        leading-tight
        ${className ?? ''}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
}
