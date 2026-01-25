import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

//CRUD operations
export const getPosts = async () => {
  const response = await axios.get(`${API_URL}/posts`);
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  console.log("API_URL:", API_URL);
  console.log("Full URL:", `${API_URL}/posts/new`);
  const response = await axios.post(`${API_URL}/posts/new`, postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  console.log("Post Update received:", { id, postData });
  console.log("Building URL with id:", id); // Add this line
  const url = `${API_URL}/posts/update/${id}`; // Build URL separately
  console.log("Full URL:", url); // Log the complete URL
  const response = await axios.patch(url, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await axios.delete(`${API_URL}/posts/${id}`);
  return response.data;
};
