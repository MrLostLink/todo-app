import React, { Fragment, useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { TaskContext } from "../../context/TaskContext";

const TaskAdd = () => {
  const nT_Title = useRef("");
  const nT_Desc = useRef("");
  const taskContext = useContext(TaskContext);
  const [formError, setFormError] = useState(false);
  const [httpError, setHTTPError] = useState("");
  const [disable, setDisable] = useState(false);
  const navigate = useHistory();

  const pageRedirect = () => {
    navigate.push('/');
  };

  const onSubmitHandler = async (event) => {
    setDisable(true);
    if(formError)  
        setFormError(false);
    if(httpError !== "")
        setHTTPError("");
    event.preventDefault();

    if (nT_Title.current.value.trim() === "" || nT_Desc.current.value.trim() === "") {
      setFormError(true);
      setDisable(false);
      return;
    }

    const resp = await taskContext.addTask(nT_Title.current.value, nT_Desc.current.value);
    if(resp.code !== 1 ){
        setHTTPError(resp.code + ': ' + resp.msg);
        setDisable(false);
        return;
    } else {
        setHTTPError("Success! You will now be redirected to the main page...");
        setTimeout(pageRedirect, 3000);
    }
  };

  return (
    <Fragment>
      <form onSubmit={onSubmitHandler}>
        <label htmlFor="nT_Title">Title: </label>
        <input type="text" id="nT_Title" ref={nT_Title}></input>
        <label htmlFor="nT_Desc">Description</label>
        <input type="text" id="nT_Desc" ref={nT_Desc}></input>
        <input type="submit" value="Add new Task" disabled={disable}></input>
      </form>
      {formError && (
        <p style={{ color: "red" }}>
          Please enter a valid task title and description
        </p>
      )}
      {httpError && (
          <p style={{ color: "red"}}>
              {httpError}
          </p>
      )}

    </Fragment>
  );
};

export default TaskAdd;
