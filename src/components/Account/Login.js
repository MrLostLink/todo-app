import { useHistory, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "../../context/LoginContext";
import { Button, Grid, TextField, Typography, Stack } from "@mui/material";
import { Box, Container } from "@mui/system";
import CottageRoundedIcon from '@mui/icons-material/CottageRounded';
import styles from "./Login.module.css";

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

    // eslint-disable-next-line no-unused-vars
    const resp = loginContext.loginAccount(emailState, pwState).then((obj) => {
      if (obj.code === 2) {
        setErrorState(obj.message);
        setButtonState(false);
      } else {
        setErrorState("Logged in! Redirecting...");
        navigate.push("/");
      }
    });
  };

  const onChangeHandler = (event) => {
    if (event.target.id === "login_username") {
      setEmailState(event.target.value);
    } else if (event.target.id === "login_password") {
      setPwState(event.target.value);
    }
  };

  return (
    <div className={styles.containerHmd}>
      <Container component="main" maxWidth="xs">
        <Stack alignItems="center">
          <CottageRoundedIcon fontSize="large"/>
          <Typography variant="h3">Login</Typography>
        </Stack>
        <Box component="form" onSubmit={submitHandler}>
          <TextField
            margin="normal"
            fullWidth
            id="login_username"
            label="Email Address"
            name="email"
            onChange={onChangeHandler}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="login_password"
            onChange={onChangeHandler}
          />
          <div className={styles.containerHsm}>
            <Button type="submit" variant="contained" disabled={buttonState}>
              Sign In
            </Button>
          </div>
          <Grid container>
            <Grid item>
              <Link to="/register">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
        {errorState && <p>{errorState}</p>}
      </Container>
    </div>
  );
};

export default Login;
