import CryptoJS from 'crypto-js';

const API_URL = '/api';

export function getGravatarHash(email: string) {
  return CryptoJS.MD5(email.trim().toLowerCase()).toString();
}

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' })) as any;
    throw new Error(error.error || response.statusText);
  }

  return response.json();
}

export async function login(data: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err.error);
  }
  const json = await res.json() as any;
  json.user.emailHash = getGravatarHash(json.user.email);
  localStorage.setItem('token', json.token);
  localStorage.setItem('user', JSON.stringify(json.user));
  return json.user;
}

export async function register(data: any) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err.error);
  }
  const json = await res.json() as any;
  json.user.emailHash = getGravatarHash(json.user.email);
  localStorage.setItem('token', json.token);
  localStorage.setItem('user', JSON.stringify(json.user));
  return json.user;
}

export async function getComments() {
  return fetchWithAuth('/comments');
}

export async function postComment(data: any) {
  return fetchWithAuth('/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function editComment(id: number, content: string) {
  return fetchWithAuth(`/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
}

export async function deleteComment(id: number) {
  return fetchWithAuth(`/comments/${id}`, {
    method: 'DELETE'
  });
}

export async function reactComment(id: number, emoji: string | null) {
  return fetchWithAuth(`/comments/${id}/react`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emoji })
  });
}

export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = getToken();
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}/media/upload`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!res.ok) {
    const err = await res.json() as any;
    throw new Error(err.error);
  }
  return res.json();
}
