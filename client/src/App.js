//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login/login";
import Register from "./components/Login/register";
import Landing from "./components/Gen/landing";
import NavBar from "./components/Gen/NavBar";

import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import jwt_decode from "jwt-decode";
import PrivateUserRoute from "./components/private-routes/PrivateUserRoute";
import PrivateAdminRoute from "./components/private-routes/PrivateAdminRoute";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds

  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <NavBar />
          <Route exact path="/" component={Landing} />
          <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />              
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
