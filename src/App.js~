import React, { useEffect } from "react";
import "./assets/main.css";
import {
  Login,
  Register,
  Home,
  ChatRoom,
  EditUser,
  VerifikasiUser,
  RenewPassword,
  ResetPassword,
} from "./pages/index";

// Library
import { Beforeunload, useBeforeunload } from "react-beforeunload";
// Router Navigation
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Auth } from "./config";
import axios from "axios";
import { urlApiMain } from "./utils/url";

const App = () => {
  if (Auth.isAuthenticated()) {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + Auth.getTokenAndUserId().token;
    sessionStorage.setItem("show_notification", 0);
  }

  const sendStatus = () => {
    if (!Auth.isAuthenticated()) {
      sessionStorage.setItem("status_user", 0);
    } else {
      sessionStorage.setItem("status_user", 1);
      const status = sessionStorage.getItem("status_user");
      if (status == 1) {
        axios
          .get(`${urlApiMain}updateuser/${Auth.getTokenAndUserId().userid}`)
          .then((res) => {
            console.log(res);
          })
          .catch();
      }
    }
  };

  const onClose = () => {
    axios
      .get(`${urlApiMain}updateuserclose/${Auth.getTokenAndUserId().userid}`)
      .then((res) => {
        console.log(res);
      })
      .catch();
  };

  useBeforeunload(() => "wowowkwkwk");
  useEffect(() => {
    sendStatus();
  }, []);

  return (
    <Beforeunload onBeforeunload={onClose}>
      <Router>
        <Switch>
          <Route
            path="/login"
            render={() =>
              !Auth.isAuthenticated() ? <Login /> : <Redirect to="/" />
            }
          />
          <Route
            path="/register"
            render={() =>
              !Auth.isAuthenticated() ? <Register /> : <Redirect to="/" />
            }
          />
          <Route
            path="/"
            exact
            render={() =>
              Auth.isAuthenticated() ? <Home /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/chat/:id"
            exact
            render={({ match }) =>
              Auth.isAuthenticated() ? <ChatRoom /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/edit_user"
            exact
            render={({ match }) =>
              Auth.isAuthenticated() ? <EditUser /> : <Redirect to="/login" />
            }
          />
          <Route
            path="/verify_account"
            exact
            render={() =>
              !Auth.isAuthenticated() ? <VerifikasiUser /> : <Redirect to="/" />
            }
          />
          <Route
            path="/reset_password"
            exact
            render={() =>
              !Auth.isAuthenticated() ? <ResetPassword /> : <Redirect to="/" />
            }
          />
          <Route
            path="/renew_password"
            exact
            render={() =>
              !Auth.isAuthenticated() ? <RenewPassword /> : <Redirect to="/" />
            }
          />
        </Switch>
      </Router>
    </Beforeunload>
  );
};

export default App;
