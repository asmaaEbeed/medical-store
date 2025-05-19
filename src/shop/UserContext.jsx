import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api/auth.api";
import {userAPI} from '../services/api/user.api';
import axios from 'axios';
import ProfileEdit from "../Components/UserDashboard/components/ProfileEdit";
export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userOrderLoading, setUserOrderLoading] = useState(false);
  const [userOrdersList, setUserOrdersList] = useState([]);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setUserToken(token);
      // Make sure axios is configured with the token
      axios.defaults.headers.common['authorization'] = `pharma__${token}`;
    }
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
      const response = await authAPI.login(credentials);
      const token = response.data.token;
      localStorage.setItem("userToken", token);
      // Set the token in axios headers
      axios.defaults.headers.common['authorization'] = `pharma__${token}`;
      setUserToken(token);
      await fetchProfile(token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingToken(false);
    }
  };

  

  const register = async (userData) => {
    try {
      setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
      const response = await authAPI.register(userData);
      // const token = response.data.token;
      // localStorage.setItem("userToken", token);
      // Set the token in axios headers
      // axios.defaults.headers.common['Authorization'] = `pharma__${token}`;
      // setUserToken(token);
      // await fetchProfile(token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingToken(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
    // setIsLoadingToken(true);
    await authAPI.logout();
      localStorage.removeItem("userToken");
      localStorage.removeItem("token");
      // Remove the token from axios headers
      delete axios.defaults.headers.common['Authorization'];
      setUserToken(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
      setIsLoadingToken(false);

    }
  };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
      const response = await userAPI.getProfile();

      setUserProfile(response.data.user);
      return response;
    } catch (err) {
       setError(err.response?.data?.message || "Failed to fetch profile");
      if (err.response?.status === 401) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("token");
        setUserToken(null);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingToken(false);

    }
  };

  const updateProfile = async (userData, id) => {
    try {
      setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
      
      const response = await userAPI.updateUserProfile(userData, id); 
      setUserProfile(response.data.user);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingToken(false);

    }
  };

  const changePassword = async (passwords) => {
    try {
      setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
      const response = await userAPI.changePassword(passwords); 
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      throw err;
    } finally {
      setIsLoading(false);
      setIsLoadingToken(false);

    }
  };

  const sendPasswordResetCode = async (email) => {
    setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
    try {
      // Update to pass the email object correctly
      const response = await authAPI.sendCode(email);
      setIsLoading(false);

      return response;
    } catch (err) {
      setError(err?.response.data?.error || 'Failed to send verification code');
      setIsLoading(false);
      setIsLoadingToken(false);

      throw err;
    }
  };



  const resetPassword = async (email, forgetCode, newPassword) => {
    setIsLoading(true);
    // setIsLoadingToken(true);
    setError(null);
    try {
      // Update to pass the email object correctly
      const response = await authAPI.resetPassword(email, forgetCode, newPassword);
      // const response = await axios.put('http://localhost:5000/auth/resetPass', {email, forgetCode, newPassword});
      setIsLoading(false);

      return response;
    } catch (err) {
      setError(err?.response || 'Failed to send verification code');
      setIsLoading(false);
      setIsLoadingToken(false);

      throw err;
    }
  };

  const getUserOrders = async () => {
    try {
      setUserOrderLoading(true);
      const response = await userAPI.getUserOrders();
      setUserOrdersList(response.data.orders);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      throw err;
    } finally {
      setUserOrderLoading(false);
    }
  };

const refreshUserData = async () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    try {
      // Set the token in axios headers to ensure it's used for this request
      axios.defaults.headers.common['authorization'] = `pharma__${token}`;
      
      // Make an API call to validate token and get user data
      const response = await userAPI.getProfile();
      
      // If we get a successful response, the token is valid
      setUserData(response.data.user);
      setUserProfile(response.data.user);
      setUserToken(token);
      return true;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // If token is invalid, clear it
      localStorage.removeItem('userToken');
      setUserToken(null);
      setUserData(null);
      setUserProfile(null);
      return false;
    }
  }
  return false;
};


  return (
    <UserContext.Provider
      value={{
        userToken,
        setUserToken,
        userProfile,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isLoading,
        error,
        sendPasswordResetCode,
        resetPassword,
        fetchProfile,
        isLoadingToken,
        getUserOrders,
        userOrdersList,
        userOrderLoading,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;