import React from 'react';
import { Row} from 'antd';
import type { RowProps} from 'antd';
import { cn } from '../../utils/cn';

// Grid Row
// Interface{
  className?;
}

export const GridRow.FC<GridRowProps> = ({
  children,
  className,
  gutter = [16, 16],
  ...props
}) => {
  return (
    <AntRow gutter={gutter} className={className} {...props}>
      {children}
    </AntRow>
  );
};

GridRow.displayName = 'GridRow';

// Grid Col
// Interface{
  className?;
}

export const GridCol.FC<GridColProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <AntCol className={className} {...props}>
      {children}
    </AntCol>
  );
};

GridCol.displayName = 'GridCol';

// Simple Grid
// Interface{
  children.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'small' | 'medium' | 'large';
  className?;
}

export const SimpleGrid.FC<SimpleGridProps> = ({
  children,
  columns = 3,
  gap = 'medium',
  className,
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }[columns];

  const gapClass = {
    small: 'gap-3',
    medium: 'gap-4',
    large: 'gap-6',
  }[gap];

  return (
    <div className={cn('grid', colsClass, gapClass, className)}>
      {children}
    </div>
  );
};

SimpleGrid.displayName = 'SimpleGrid';

// Auto Grid (auto-fit columns)
// Interface{
  children.ReactNode;
  minWidth?;
  gap?: 'small' | 'medium' | 'large';
  className?;
}

export const AutoGrid.FC<AutoGridProps> = ({
  children,
  minWidth = 280,
  gap = 'medium',
  className,
}) => {
  const gapSize = { small: 12, medium: 16, large: 24 }[gap];

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap}}
    >
      {children}
    </div>
  );
};

AutoGrid.displayName = 'AutoGrid';

// Responsive Columns helper
export const responsiveCols = {
  full: { xs: 24 },
  half: { xs: 24, md: 12 },
  third: { xs: 24, md: 12, lg: 8 },
  quarter: { xs: 24, md: 12, lg: 6 },
  twoThirds: { xs: 24, md: 16 },
  oneThird: { xs: 24, md: 8 },
};

