import axiosInstance from "./axiosInstance";

/**
 * GET /users/profile-data — the logged-in user's own profile.
 */
export const getMyProfile = () => axiosInstance.get("/users/profile-data");

/**
 * PUT /users/upload-photo — multipart form upload, field name is a guess
 * ("photo") until confirmed against the Postman body — adjust here only.
 */
export const uploadProfilePhoto = (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  return axiosInstance.put("/users/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * GET /users/bookmarks — posts the current user has saved.
 */
export const getBookmarks = (params?: Record<string, unknown>) =>
  axiosInstance.get("/users/bookmarks", { params });

/**
 * GET /users/suggestions?limit=10 — follow suggestions.
 */
export const getSuggestions = (limit = 10) =>
  axiosInstance.get("/users/suggestions", { params: { limit } });

/**
 * GET /users/:id/profile — another (or the same) user's public profile.
 */
export const getUserProfile = (userId: string) =>
  axiosInstance.get(`/users/${userId}/profile`);

/**
 * PUT /users/:id/follow — toggles follow/unfollow for that user.
 */
export const toggleFollow = (userId: string) =>
  axiosInstance.put(`/users/${userId}/follow`);

/**
 * GET /users/:id/posts — a specific user's posts (nested route).
 */
export const getUserPosts = (userId: string, params?: Record<string, unknown>) =>
  axiosInstance.get(`/users/${userId}/posts`, { params });
