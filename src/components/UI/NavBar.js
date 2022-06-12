import { LoginContext } from "../../context/LoginContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import { AppBar, Stack, Typography } from "@mui/material";
import { Container } from "@mui/system";
import logo from "../../assets/logo.png";
import styles from "./NavBar.module.css";

const pages = [
  { key: "view-tasks", title: "View Tasks", link: "/" },
  { key: "add-tasks", title: "Add Task", link: "/add" },
];

const NavBar = () => {
  const loginContext = useContext(LoginContext);
  const navigate = useHistory();
  const logoutHandler = () => {
    loginContext.logoutAccount();
    navigate.push("/login");
  };

  const navBarTabs = pages.map((page, index) => {
    return (
      <Button variant="button" key={index} href={page.link}>
        {page.title}
      </Button>
    );
  });

  return (
    <AppBar position="static" >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
        >
          <div className={styles.logoContainer}>
            <img src={logo} className={styles.logo} alt="TODO" />
            <Typography
              variant="h6"
              sx={{ letterSpacing: ".3rem", color: "white", float: "right" }}
            >
              TODO
            </Typography>
          </div>
          <Stack direction="row" spacing={0}>
            {loginContext.sessionState.uid && navBarTabs}
          </Stack>
          <Stack direction="row" spacing={0}>
            {loginContext.sessionState.uid && (
              <Button variant="button" onClick={logoutHandler}>
                Logout
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </AppBar>
  );
};

export default NavBar;
