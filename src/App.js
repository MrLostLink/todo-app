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
import LoginProvider, { LoginContext } from "./context/LoginContext";
import { Redirect } from "react-router-dom";
import { useContext } from "react";
import * as firebaseconfig from './firebaseconfig.json';

function App() {

  const firebaseConfig = {
    apiKey: firebaseconfig.apiKey,
    authDomain: firebaseconfig.authDomain,
    databaseURL: firebaseconfig.databaseURL,
    projectId: firebaseconfig.projectId,
    storageBucket: firebaseconfig.storageBucket,
    messagingSenderId: firebaseconfig.messagingSenderId,
    appId: firebaseconfig.appId
  };
  
  const app = initializeApp(firebaseConfig);

  const loginState = useContext(LoginContext);
  console.log(loginState.sessionState);
  return (
    <LoginProvider>
        <TaskProvider>
        <NavBar />
        <Switch>
          {loginState.sessionState.uid &&<Route path="/" exact>
            <TaskList></TaskList>
          </Route>}
          {loginState.sessionState.uid && <Route path="/add">
            <TaskAdd/>
          </Route>}
          {loginState.sessionState.uid && <Route path="/edit/:taskID">
            <TaskEdit />
          </Route>}
          {!loginState.sessionState.uid && <Route path="/register">
            <Register></Register>
          </Route>}
          {!loginState.sessionState.uid && <Route path="/login">
            <Login></Login>
          </Route>}
          <Route path="*">
            {loginState.sessionState.uid && <Redirect to="/"/>}
            {!loginState.sessionState.uid && <Redirect to="/login"/>}
          </Route>
        </Switch>
      </TaskProvider>
    </LoginProvider>
  );
}

export default App;
