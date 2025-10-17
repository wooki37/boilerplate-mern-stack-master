import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
} from './types';
import { USER_SERVER } from '../components/Config.js';

// axios.defaults.withCredentials = false;

const authApi = axios.create({
    baseURL: USER_SERVER,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
});

export function registerUser(dataToSubmit) {
  const request = authApi
    .post('/register', dataToSubmit)
    .then(response => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  const request = authApi
    .post('/login', dataToSubmit)
    .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request,
    };
}

export function auth() {
    const request = authApi
        .get('/auth')
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = authApi
        .get('/logout')
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

