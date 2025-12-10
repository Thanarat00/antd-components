import React from 'react';
import { Flex } from 'antd';
import { cn } from '../../utils/cn';



/**
 * CustomFlex - Enhanced Flex container
 */
export const CustomFlex = ({
  children,
  className,
  ...props
}) => {
  return (
    <Flex className={className} {...props}>
      {children}
    </Flex>
  );
};

CustomFlex.displayName = 'CustomFlex';

// Row (horizontal flex)


export const Row = ({
  children,
  gap = 'medium',
  align = 'center',
  justify = 'start',
  wrap = false,
  className }) => {
  const gapSize = { none: 0, small: 8, medium: 16, large: 24 }[gap];
  const alignItems = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }[align];
  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly' }[justify];

  return (
    <Flex
      gap={gapSize}
      align={alignItems}
      justify={justifyContent}
      wrap={wrap}
      className={className}
    >
      {children}
    </Flex>
  );
};

Row.displayName = 'Row';

// Column (vertical flex)


export const Column = ({
  children,
  gap = 'medium',
  align = 'stretch',
  className }) => {
  const gapSize = { none: 0, small: 8, medium: 16, large: 24 }[gap];
  const alignItems = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch' }[align];

  return (
    <Flex
      vertical
      gap={gapSize}
      align={alignItems}
      className={className}
    >
      {children}
    </Flex>
  );
};

Column.displayName = 'Column';

// Center (centered content)


export const Center = ({
  children,
  className }) => {
  return (
    <Flex
      align="center"
      justify="center"
      className={cn('w-full', className)}
    >
      {children}
    </Flex>
  );
};

Center.displayName = 'Center';

// Spacer (flexible space)
export const Spacer.FC = () => {
  return <div className="flex-1" />;
};

Spacer.displayName = 'Spacer';

