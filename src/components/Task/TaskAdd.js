import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { TaskContext } from "../../context/TaskContext";
import styles from "./TaskAdd.module.css";

const TaskAdd = () => {
  const nT_Title = useRef("");
  const nT_Desc = useRef("");
  const taskContext = useContext(TaskContext);
  const [formError, setFormError] = useState(false);
  const [httpError, setHTTPError] = useState("");
  const [disable, setDisable] = useState(false);
  const navigate = useHistory();

  const pageRedirect = () => {
    navigate.push("/");
  };

  const onSubmitHandler = async (event) => {
    setDisable(true);
    if (formError) setFormError(false);
    if (httpError !== "") setHTTPError("");
    event.preventDefault();

    if (
      nT_Title.current.value.trim() === "" ||
      nT_Desc.current.value.trim() === ""
    ) {
      setFormError(true);
      setDisable(false);
      return;
    }

    const resp = await taskContext.addTask(
      nT_Title.current.value,
      nT_Desc.current.value
    );
    if (resp.code !== 1) {
      setHTTPError(resp.code + ": " + resp.msg);
      setDisable(false);
      return;
    } else {
      setHTTPError("Success! You will now be redirected to the main page...");
      setTimeout(pageRedirect, 3000);
    }
  };

  return (
    <div className={styles.containerHmd}>
      <Container component="main" maxWidth="xs">
        <Stack alignItems="center" component="form" onSubmit={onSubmitHandler}>
          <Typography variant="h3">Add new task</Typography>
          <TextField
            margin="normal"
            fullWidth
            id="nT_Title"
            label="Task Title"
            name="title"
            inputRef={nT_Title}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            label="Task Description"
            id="nT_Desc"
            inputRef={nT_Desc}
            multiline
            rows={4}
          />
          <div className={styles.containerHsm}>
            <Button type="submit" variant="contained" disabled={disable}>
              Add
            </Button>
          </div>
        </Stack>
        {formError && (
          <p style={{ color: "red" }}>
            Please enter a valid task title and description
          </p>
        )}
        {httpError && <p style={{ color: "red" }}>{httpError}</p>}
      </Container>
    </div>
  );
};

export default TaskAdd;
