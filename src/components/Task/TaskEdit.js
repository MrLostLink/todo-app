import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { TaskContext } from "../../context/TaskContext";
import styles from "./TaskEdit.module.css";

const TaskEdit = () => {
  const [errorState, setErrorState] = useState(false);
  const taskID = useParams().taskID;
  const taskContext = useContext(TaskContext);
  const [viewTask, setViewTask] = useState({
    title: "",
    id: "",
    description: "",
    dateAdded: "",
  });
  const [httpError, setHTTPError] = useState("");
  const [disable, setDisable] = useState(false);
  const navigate = useHistory();

  const pageRedirect = () => {
    navigate.push("/");
  };

  useEffect(() => {
    const taskDetails = taskContext.taskState.find((task) => {
      return task.id === taskID;
    });
    if (taskDetails) setViewTask(taskDetails);
  }, [taskContext.taskState, taskID]);

  const onChangeHandler = (event) => {
    if (event.target.id === "task-title") {
      setViewTask({ ...viewTask, title: event.target.value });
    } else if (event.target.id === "task-description") {
      setViewTask({...viewTask, description: event.target.value });
    }
  };

  const formSubmitHandler = async (event) => {
    setErrorState(false);
    setDisable(true);
    event.preventDefault();
    if (viewTask.title === "" || viewTask.description === "") {
      setDisable(false);
      setErrorState(true);
      return;
    }
    setErrorState(false);
    const resp = await taskContext.adjustTask({
      taskID,
      taskTitle: viewTask.title,
      taskDescription: viewTask.description,
      dateAdded: viewTask.dateAdded,
    });

    if (resp.code !== 1) {
      setErrorState(true);
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
        <Stack
          alignItems="center"
          component="form"
          onSubmit={formSubmitHandler}
        >
          <Typography variant="h3">Edit task</Typography>
          <TextField
            margin="normal"
            fullWidth
            id="task-title"
            label="Task Title"
            name="title"
            value={viewTask.title}
            onChange={onChangeHandler}
          />
          <TextField
            margin="normal"
            fullWidth
            name="description"
            label="Task Description"
            id="task-description"
            value={viewTask.description}
            onChange={onChangeHandler}
            multiline
            rows={4}
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={styles.fullWidth}
          >
            <TextField
              margin="normal"
              name="dateadded"
              label="Date Added"
              id="task-dateadded"
              value={viewTask.dateAdded}
              disabled
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{ height: 40 }}
              disabled={disable}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
        {errorState && httpError === "" && (
          <p>Fields entered cannot be empty</p>
        )}
        {httpError}
      </Container>
    </div>
  );
};

export default TaskEdit;
