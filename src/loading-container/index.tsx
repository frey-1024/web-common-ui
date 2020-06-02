import React from 'react';
import classNames from 'classnames';
import LoadingIcon from '../loading-icon';

export interface LoadingContainerProps {
  loading?: boolean;
  className?: string;
  children?: React.ReactChild;
}

const cls = 'ab-loading-container';

export default function LoadingContainer(props: LoadingContainerProps) {
  const { loading = false, className, children } = props;
  return (
    <div className={classNames(className, cls, { [`${cls}-active`]: loading })}>
      {children}
      {loading && (
        <div className={`${cls}-icon-box`}>
          <LoadingIcon className={`${cls}-icon`} />
        </div>
      )}
    </div>
  );
}
