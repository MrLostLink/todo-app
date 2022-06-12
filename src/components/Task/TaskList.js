import { Fragment, useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskDisplay from "./TaskDisplay";

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
      <input value={filterState} onChange={filterChangeHandler}></input>
      <table>
        <tbody>
          {listState.map((task) => {
            return (
              <TaskDisplay
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                dateAdded={task.dateAdded}
                completedHandler={completedHandler}
              />
            );
          })}
        </tbody>
      </table>
      {errorMsg && <p>{errorMsg}</p>}
    </Fragment>
  );
};

export default TaskList;
