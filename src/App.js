import "./App.css";
import NavBar from "./components/UI/NavBar";
import TaskList from "./components/Task/TaskList";
import TaskProvider from "./context/TaskContext";
import { Route } from "react-router-dom";
import TaskEdit from "./components/Task/TaskEdit";
import { Switch } from "react-router-dom";
import TaskAdd from "./components/Task/TaskAdd";
import Login from "./components/Account/Login";
import Register from "./components/Account/Register";
import { initializeApp } from "firebase/app";
import LoginProvider from "./context/LoginContext";
import { Redirect } from "react-router-dom";
import fbConfig from "./firebaseconfig.json";
import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

function App() {

  const firebaseConfig = {
    apiKey: fbConfig.apiKey,
    authDomain: fbConfig.authDomain,
    databaseURL: fbConfig.databaseURL,
    projectId: fbConfig.projectId,
    storageBucket: fbConfig.storageBucket,
    messagingSenderId: fbConfig.messagingSenderId,
    appId: fbConfig.appId,
  };

  // eslint-disable-next-line no-unused-vars
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const [loggedIn, setloggedIn] = useState(true);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) 
        setloggedIn(true);
      else  
        setloggedIn(false);
    });
  
  }, [auth])
  return (
    <LoginProvider>
      <TaskProvider>
        <NavBar />
        <Switch>
          {!loggedIn && (
            <Route path="/login">
              <Login></Login>
            </Route>
          )}
          {!loggedIn && (<Route path="/register">
            <Register></Register>
          </Route>)}
          {!loggedIn && (
            <Route path="*">
              <Redirect to="/login" />
            </Route>
          )}
          <Route path="/" exact>
            <TaskList></TaskList>
          </Route>
          <Route path="/add">
            <TaskAdd />
          </Route>
          <Route path="/edit/:taskID">
            <TaskEdit />
          </Route>

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </TaskProvider>
    </LoginProvider>
  );
}

export default App;
