import { ReactNode } from 'react';

interface RenderWhenPrimitiveProps {
  value: ReactNode;
  children: ReactNode;
}

export const RenderWhenPrimitive = (props: RenderWhenPrimitiveProps) => {
  const { value, children } = props;

  return isPrimitive(value) ? children : <>{value}</>;
};

const isPrimitive = (value: ReactNode) => {
  return typeof value === 'string' || typeof value === 'number';
};
