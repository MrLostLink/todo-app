import { Link } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { useContext } from "react";
import { useHistory } from "react-router-dom";

const pages = [
  { key: 'view-tasks', title: "View Tasks", link: "/" },
  { key: 'add-tasks', title: "Add Task", link: "/add" },
];

const NavBar = () => {

  const loginContext = useContext(LoginContext);
  const navigate = useHistory();
  const logoutHandler = () => {
    loginContext.logoutAccount();
    navigate.push('/login');
  };  

  const navBarTabs = pages.map((page, index) => {
    return <Link key={page.key} to={page.link}><button key={index}>{page.title}</button></Link>
  });

  return (
    <div>
        <p>LOGO</p>
        {loginContext.sessionState.idToken && navBarTabs}
        {loginContext.sessionState.idToken && <button onClick={logoutHandler}>Logout</button>}
    </div>
  );
};

export default NavBar;
