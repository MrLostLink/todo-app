import { Fragment, useContext, useEffect, useState } from "react";
import { TaskContext } from "../../context/TaskContext";
import TaskDisplay from "./TaskDisplay";

const TaskList = () => {
  const DUMMY_LIST = useContext(TaskContext).taskState;
  const [filterState, setFilterState] = useState("");
  const [listState, setListState] = useState([]);

  const filterChangeHandler = (event) => {setFilterState(event.target.value);}

  useEffect(() => {
    const filterList = () => {
      let fRows = DUMMY_LIST.filter((item) => {
        return item.title.includes(filterState) || item.description.includes(filterState);
      });
      setListState(fRows);
    };
    const inputTimeout = setTimeout(filterList, 1500);
    return () => {
      clearTimeout(inputTimeout);
    };
  }, [filterState, DUMMY_LIST]);

  return (
    <Fragment>
      <input value={filterState} onChange={filterChangeHandler}></input>
      <table>
        <tbody>{listState.map((task) => {
    return (
      <TaskDisplay
        key={task.id}
        id={task.id}
        title={task.title}
        description={task.description}
        dateAdded={task.dateAdded}
      />
    );
  })}</tbody>
      </table>
    </Fragment>
  );
};

export default TaskList;
