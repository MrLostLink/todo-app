import { createContext, useReducer, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const INITIAL_STATE = {
  idToken: '',
  uid: ''
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case "login": {
      return {
        idToken: action.payload.userCredential.idToken,
        uid: action.payload.uid,
      };
    }
    case "logout": {
      return {
          idToken: '',
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
    if (sessionStorage.getItem("Auth Token")) {
      sessionDispatch({
        type: "login",
        payload: {
            uid: sessionStorage.getItem("Auth UID"),
          userCredential: {
            idToken: sessionStorage.getItem("Auth Token")
          },
        },
      });
    }
  }, []);

  const createAccount = async (user, pass) => {
    const auth = getAuth();
    try {
      const resp = await createUserWithEmailAndPassword(auth, user, pass);
      sessionDispatch({
        type: "login",
        payload: { uid: resp.user.uid, userCredential: resp._tokenResponse },
      });
      sessionStorage.setItem("Auth Token", resp._tokenResponse.idToken);
      sessionStorage.setItem("Auth UID", resp.user.uid);
      return { code: 1, message: "success" };
    } catch (error) {
      return { code: error.code, message: error.message };
    }
  };

  const loginAccount = async (user, pass) => {
    //sessionDispatch({type:'login', payload: {userCredential: resp._tokenResponse}});
    const auth = getAuth();
    try {
      const resp = await signInWithEmailAndPassword(auth, user, pass);
      console.log(resp);
      sessionDispatch({
        type: "login",
        payload: { uid: resp.user.uid, userCredential: resp._tokenResponse },
      });
      sessionStorage.setItem("Auth Token", resp._tokenResponse.idToken);
      sessionStorage.setItem("Auth UID", resp.user.uid);
      return { code: 1, message: "success" };
    } catch (error) {
      return { code: error.code, message: error.message };
    }
  };

  const logoutAccount = () => {
    const auth = getAuth();
    signOut(auth);
    sessionDispatch({ type: "logout" });
    sessionStorage.removeItem("Auth Token");
    sessionStorage.removeItem("Auth UID");
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
