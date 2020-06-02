export default function(fn, delay = 250, isImmediately = false) {
  let timer;
  const debounce = function() {
    if (timer) {
      clearTimeout(timer);
    }
    if (isImmediately) {
      if (!timer) {
        fn.apply(this, arguments);
      }
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    }
  };
  debounce.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };
  return debounce;
}
