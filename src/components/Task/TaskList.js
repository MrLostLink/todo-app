import { Container, Grid, TextField } from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskDisplay from "./TaskDisplay";
import styles from "./TaskList.module.css";

const TaskList = () => {
  const taskContext = useContext(TaskContext);
  const taskList = taskContext.taskState;
  const [filterState, setFilterState] = useState("");
  const [listState, setListState] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const filterChangeHandler = (event) => {
    setFilterState(event.target.value);
  };

  const completedHandler = async (obj) => {
    const res = taskContext.markCompleted(obj);
    if (res.code === 2) {
      setErrorMsg(res.message);
      return false;
    } else return true;
  };

  useEffect(() => {
    const filterList = () => {
      let fRows = taskList.filter((item) => {
        return (
          item.title.includes(filterState) ||
          item.description.includes(filterState)
        );
      });
      setListState(fRows);
    };
    const inputTimeout = setTimeout(filterList, 1500);
    return () => {
      clearTimeout(inputTimeout);
    };
  }, [filterState, taskList]);

  return (
    <Fragment>
      <Container component="main" maxWidth="md">
        <TextField
          id="tf_search"
          label="Search"
          variant="standard"
          value={filterState}
          onChange={filterChangeHandler}
          className={styles.tf_search}
        />
        <Grid container spacing={2}>
          {listState.map((task) => {
            return (
              <Grid item key={task.id}>
              <TaskDisplay
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dateAdded={task.dateAdded}
                completedHandler={completedHandler}
              />
              </Grid>
            );
          })}
        </Grid>
        {errorMsg && <p>{errorMsg}</p>}
      </Container>
    </Fragment>
  );
};

export default TaskList;
