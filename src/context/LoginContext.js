import { createContext, useReducer, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";

const INITIAL_STATE = {
  uid: ''
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case "login": {
      return {
        uid: action.payload.uid,
      };
    }
    case "logout": {
      return {
        uid: ''
      };
    }
    default:
      return state;
  }
};

const LoginContext = createContext({
  sessionState: INITIAL_STATE,
  createAccount: () => {},
  loginAccount: () => {},
  logoutAccount: () => {},
});

const LoginProvider = (props) => {
  const [sessionState, sessionDispatch] = useReducer(
    sessionReducer,
    INITIAL_STATE
  );

  useEffect(() => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        sessionDispatch({
          type: "login",
          payload: {
              uid: auth.currentUser.uid,
          },
        });
    }});
  }, []);

  const createAccount = async (user, pass) => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence);
    try {
      const resp = await createUserWithEmailAndPassword(auth, user, pass);
      sessionDispatch({
        type: "login",
        payload: { uid: resp.user.uid },
      });
      return { code: 1, message: "success" };
    } catch (error) {
      return { code: 2, message: error.message };
    }
  };

  const loginAccount = async (user, pass) => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence);
    try {
      const resp = await signInWithEmailAndPassword(auth, user, pass);
      sessionDispatch({
        type: "login",
        payload: { uid: resp.user.uid },
      });
      return { code: 1, message: "success" };
    } catch (error) {
      return { code: 2, message: error.message };
    }
  };

  const logoutAccount = () => {
    const auth = getAuth();
    signOut(auth);
    sessionDispatch({ type: "logout" });
  };

  const value = {
    sessionState,
    createAccount,
    loginAccount,
    logoutAccount,
  };

  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
export { LoginContext };
