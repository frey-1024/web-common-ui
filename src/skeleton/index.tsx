import React, { ReactChild } from 'react';
import classNames from 'classnames';
import Item from './Item';

interface SkeletonProps {
  loading: boolean;
  content: ReactChild;
  children?: ReactChild;
  active?: boolean;
  rows?: number;
  className?: string;
}

const cls = 'ab-skeleton';

const Skeleton = (props: SkeletonProps) => {
  const { children, content, loading, active, rows, className } = props;
  if (loading) {
    return (
      <div className={classNames(cls, className, { [`${cls}-active`]: active })}>
        {[...Array(rows)].map((_item, index) => {
          return <React.Fragment key={index}>{content}</React.Fragment>;
        })}
      </div>
    );
  }
  return children;
};

Skeleton.Item = Item;
Skeleton.defaultProps = {
  active: true,
  rows: 1
};

export default Skeleton;
