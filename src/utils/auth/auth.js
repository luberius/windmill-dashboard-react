import Cookies from 'js-cookie';

export const checkLogin = () => {
  return Cookies.get('token');
};

export const login = (token) => {
  Cookies.set('token', token);
};

export const logout = () => {
  Cookies.remove('token');
};
