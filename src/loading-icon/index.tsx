import React from 'react';
import classNames from 'classnames';

const cls = 'ab-svg-loading';

export interface LoadingIconProps {
  className?: string;
}

const LoadingIcon = (props: LoadingIconProps) => {
  const { className } = props;
  return (
    <span className={classNames(className, cls)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={`${cls}-icon`}
      >
        <circle cx="12" cy="2" r="2" fill="#202020" />
        <circle cx="19" cy="5" r="2" fill="#404040" />
        <circle cx="22" cy="12" r="2" fill="#606060" />
        <circle cx="19" cy="19" r="2" fill="gray" />
        <circle cx="12" cy="22" r="2" fill="#b0b0b0" />
        <circle cx="5" cy="19" r="2" fill="#d0d0d0" />
        <circle cx="2" cy="12" r="2" fill="#f0f0f0" />
        <circle cx="5" cy="5" r="2" fill="#fff" />
      </svg>
    </span>
  );
};

export default React.memo(LoadingIcon);
