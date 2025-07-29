/*
===============================================================================
  Module: Fetch Utility

  Description:
  This module provides utility functions for making HTTP requests using Axios.
  It includes functions for POST, GET, PUT, and DELETE requests, with automatic token handling.

  Dependencies:
  - axios

  Usage:
  How to use this module

  Author: ClowderDev
  Created: 2025-07-29
  Updated: N/A
===============================================================================
*/

import axios from "axios";

const BACKEND_URL =
  import.meta.env.BACKEND_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add a request interceptor to handle token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token ?? ""}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

//Interceptor dùng để tự động làm mới token khi hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already trying to refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          localStorage.setItem("token", newToken);
          api.defaults.headers.common["Authorization"] = "Bearer " + newToken;
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return api(originalRequest);
        } else {
          processQueue(new Error("Refresh failed"), null);
          window.dispatchEvent(new Event("force-logout"));
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        window.dispatchEvent(new Event("force-logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    // The refresh token is sent automatically as an HTTP-only cookie
    const response = await api.post("/auth/refresh-token");
    return response.data.accessToken;
  } catch (error) {
    return null;
  }
};

const postData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.post(url, data);

  return response.data;
};

const updateData = async <T>(url: string, data: unknown): Promise<T> => {
  const response = await api.put(url, data);

  return response.data;
};

const fetchData = async <T>(url: string): Promise<T> => {
  const response = await api.get(url);

  return response.data;
};

const deleteData = async <T>(url: string): Promise<T> => {
  const response = await api.delete(url);

  return response.data;
};

export { postData, fetchData, updateData, deleteData };
