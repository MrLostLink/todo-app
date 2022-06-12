import { Box, Button, Container, Grid, TextField, Stack, Typography } from "@mui/material";
import { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import styles from "./Login.module.css";
import PersonPinRoundedIcon from '@mui/icons-material/PersonPinRounded';

const Register = () => {
  const [emailState, setEmailState] = useState("");
  const [pw1State, setPw1State] = useState("");
  const [pw2State, setPw2State] = useState("");
  const [errorState, setErrorState] = useState("");
  const [buttonState, setButtonState] = useState(false);
  const navigate = useHistory();

  const loginContext = useContext(LoginContext);

  const submitHandler = async (event) => {
    setButtonState(true);
    setErrorState("");
    event.preventDefault();

    if (!pw1State || !pw2State || !emailState) {
      setErrorState("Fields cannot be empty.");
      return;
    }

    if (pw1State !== pw2State) {
      setErrorState("Passwords do not match");
      setButtonState(false);
      return;
    }

    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g;
    if (!emailState.match(emailRegex)) {
      setErrorState("Invalid email entered");
      setButtonState(false);
      return;
    }

    const resp = await loginContext.createAccount(emailState, pw1State);
    if (resp.code !== 1) {
      setErrorState(resp.message);
      setButtonState(false);
    } else {
      setErrorState("Account created! Redirecting...");
      setTimeout(() => {
        navigate.push("/");
      }, 2000);
    }
  };

  const onChangeHandler = (event) => {
    if (event.target.id === "register_email") {
      setEmailState(event.target.value);
    } else if (event.target.id === "register_pw1") {
      setPw1State(event.target.value);
    } else if (event.target.id === "register_pw2") {
      setPw2State(event.target.value);
    }
  };

  return (
    <Fragment>
      <div className={styles.containerHmd}>
        <Container component="main" maxWidth="xs">
        <Stack alignItems="center">
          <PersonPinRoundedIcon fontSize="large"/>
          <Typography variant="h3">Login</Typography>
        </Stack>
          <Box component="form" onSubmit={submitHandler}>
            <TextField
              margin="normal"
              fullWidth
              id="register_email"
              label="Email Address"
              name="email"
              onChange={onChangeHandler}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password1"
              label="Password"
              type="password"
              id="register_pw1"
              onChange={onChangeHandler}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="register_pw2"
              onChange={onChangeHandler}
            />
            <div className={styles.containerHsm}>
              <Button type="submit" variant="contained" disabled={buttonState}>
                Register
              </Button>
            </div>
            <Grid container>
              <Grid item>
                <Link to="/login">Already have an account? Log in here</Link>
              </Grid>
            </Grid>
          </Box>
          {errorState && <p>{errorState}</p>}
        </Container>
      </div>
    </Fragment>
  );
};

export default Register;
