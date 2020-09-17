import React from 'react';
import classNames from 'classnames';

const cls = 'ab-ellipsis';

const getStyle = (lines: number, maxHeight: string) => ({
  WebkitLineClamp: lines,
  maxHeight
});

export interface EllipsisProps {
  children: React.ReactNode | React.ReactNode[];
  maxHeight: string;
  className?: string;
  lines?: number;
  title?: string;
}

function Ellipsis(props: EllipsisProps) {
  const { children, maxHeight, className, lines = 2, title } = props;
  const style = getStyle(lines, maxHeight);
  const titleParam = title ? { title } : null;
  return (
    <span className={classNames(cls, className)} {...titleParam} style={style}>
      {children}
    </span>
  );
}

export default React.memo(Ellipsis);
