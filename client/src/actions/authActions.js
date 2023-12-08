/**
 * Created and implemented by Aidan Heffron
 * 
 * Auth Module to handle in-site authentication and ensure all data is secure
 */

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

/**
 * Function to register new user information into the website
 */
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post("/users/register", userData)
    .then((res) => history.push("/login")) // re-direct to login on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Function to create a separate new user information into the website (used by admins on the management page)
 */
export const createUser = (userData, history) => (dispatch) => {
  axios
    .post("/users/register", userData)
    .then((res) => history.push("/management")) // re-direct to management on successful register
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Function to login a user to the website, dispatch payload to store as a property variable for all states.
 */
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/users/login", userData)
    .then((res) => {
      // Save to localStorage
      // Set token to localStorage
      // console.log(res);
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);

      // Set token to Auth header
      setAuthToken(token);

      // Decode token to get user data
      const decoded = jwt_decode(token);    

      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Function to decode and save the payload information in website token properties
 */
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

/**
 * Function to determine if a user is still loading all information as they are logging in
 */
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

/**
 * Function to remove token information to logout a user
 */
export const logoutUser = () => (dispatch) => {
  console.log("here")
  // Remove token from local storage
  localStorage.removeItem("jwtToken");

  // Remove auth header for future requests
  setAuthToken(false);

  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
