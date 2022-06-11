import { Fragment, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";

const Register = () => {

    const [emailState, setEmailState] = useState('');
    const [pw1State, setPw1State] = useState('');
    const [pw2State, setPw2State] = useState('');
    const [errorState, setErrorState] = useState('');
    const [buttonState, setButtonState] = useState(false);
    const navigate = useHistory();

    const loginContext = useContext(LoginContext);

    const submitHandler = async (event) => {
        setButtonState(true);
        setErrorState("");
        event.preventDefault();

        if(!pw1State || !pw2State || !emailState){
            setErrorState("Fields cannot be empty.")
            return
        }

        if(pw1State !== pw2State){
            setErrorState("Passwords do not match");
            setButtonState(false);
            return
        }

        const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/g;
        if(!emailState.match(emailRegex)){
            setErrorState("Invalid email entered");
            setButtonState(false);
            return
        }

        const resp = await loginContext.createAccount(emailState, pw1State);
        if (resp.code !== 1){
            setErrorState(resp.message);
            setButtonState(false);
        } else {
            setErrorState("Account created! Redirecting...");
            setTimeout(() => {navigate.push('/')}, 2000);
        }

    };

    const onChangeHandler = (event) => {
        if(event.target.id === 'register_email'){
            setEmailState(event.target.value);
        } else if (event.target.id === 'register_pw1'){
            setPw1State(event.target.value);
        } else if (event.target.id === 'register_pw2'){
            setPw2State(event.target.value);
        }
    };

    return (
        <Fragment>
            <form onSubmit={submitHandler}>
                <label htmlFor="register_email" >Email: </label>
                <input id="register_email" value={emailState} onChange={onChangeHandler}/>
                <label htmlFor="register_pw1">Password: </label>
                <input id="register_pw1"  value={pw1State} type="password" onChange={onChangeHandler}/>
                <label htmlFor="register_pw2">Confirm Password: </label>
                <input id="register_pw2"  value={pw2State} type="password" onChange={onChangeHandler}/>
                <button type="submit" disabled={buttonState}>Submit</button>
            </form>
            {errorState && <p>{errorState}</p>}
            <p><Link to="/login">Already have an account? Log in here</Link></p>
        </Fragment>
    );
};

export default Register;