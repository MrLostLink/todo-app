import { useHistory, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "../../context/LoginContext";

const Login = () => {
  const [emailState, setEmailState] = useState("");
  const [pwState, setPwState] = useState("");
  const [errorState, setErrorState] = useState("");
  const [buttonState, setButtonState] = useState(false);

  const loginContext = useContext(LoginContext);
  const navigate = useHistory();

  const submitHandler = async (event) => {
    setButtonState(true);
    setErrorState("");
    event.preventDefault();

    if (!pwState || !emailState) {
      setErrorState("Fields cannot be empty.");
      return;
    }

    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g;
    if (!emailState.match(emailRegex)) {
      setErrorState("Invalid email entered");
      setButtonState(false);
      return;
    }

    const resp = await loginContext.loginAccount(emailState, pwState);
    if (resp.code !== 1) {
      setErrorState(resp.message);
      setButtonState(false);
    } else {
      setErrorState("Logged in! Redirecting...");
      navigate.push("/");
    }
  };

  const onChangeHandler = (event) => {
    if (event.target.id === "login_username") {
      setEmailState(event.target.value);
    } else if (event.target.id === "login_password") {
      setPwState(event.target.value);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="login_username">Email: </label>
        <input id="login_username" onChange={onChangeHandler}></input>
        <label htmlFor="login_password">Password: </label>
        <input
          id="login_password"
          type={"password"}
          onChange={onChangeHandler}
        ></input>
        <button type="submit" disabled={buttonState}>Log in</button>
      </form>
          {!errorState && <p>{errorState}</p>}
      <p>
        <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
