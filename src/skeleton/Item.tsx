import React, { CSSProperties } from 'react';
import classNames from 'classnames';

export interface ItemProps {
  className?: string;
  style?: CSSProperties;
}

const cls = 'ab-skeleton';

const Item = (props: ItemProps) => {
  const { className, style } = props;

  return <div className={classNames(`${cls}-item`, className)} style={style} />;
};

export default React.memo(Item);
