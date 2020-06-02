import React from 'react';
import Portal from '../portal';

const cls = 'ab-loading-bar';

export default function LoadingBar() {
  return (
    <Portal>
      <div className={cls}>
        <span className={`${cls}-bar`} />
      </div>
    </Portal>
  );
}
