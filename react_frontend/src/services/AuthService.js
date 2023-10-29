import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;




const login = async (login, password) => {
  try {
    const response = await axios.post(API_URL + "auth/signin", {
      login,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
