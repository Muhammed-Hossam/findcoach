import router from '../../../router.js';

let timer;

export default {
  async Authentication(context, payload) {
    const APIKEY = 'AIzaSyDdEnmXq9lEhzDEySK436C67HYMhI4nsYc';
    const loginLink =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
    const signupLink =
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp';

    const response = await fetch(
      `${payload.login ? loginLink : signupLink}?key=${APIKEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(
        responseData.message || 'Faild to authenticate, Check your Sign Up data'
      );
      throw error;
    }

    const expiresIn = +responseData.expiresIn * 1000; // plus "+" converting it to number
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    localStorage.setItem('tokenExpiration', expirationDate);

    timer = setTimeout(function () {
      context.dispatch('logout');
      router.replace('/coaches');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
    });
  },

  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expireIn = +tokenExpiration - new Date().getTime();

    if (expireIn < 0) {
      return;
    }

    timer = setTimeout(function () {
      context.dispatch('autoLogout');
    }, expireIn);

    if (token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId,
      });
    }
  },

  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
    });
  },

  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  },
};
