import Cookies from 'universal-cookie';

const cookies = new Cookies();

const options = { path: '/' };

export function getCookie(name, opts = {}) {
  opts = { ...options, ...opts };
  return cookies.get(name, opts);
}

export function setCookie(name, value, opts = {}) {
  opts = { ...options, ...opts };
  cookies.set(name, value, opts);
}

export function removeCookie(name, opts = {}) {
  opts = { ...options, ...opts };
  cookies.remove(name, opts);
}
