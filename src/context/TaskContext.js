import { createContext, useContext, useEffect, useReducer } from "react";
import { LoginContext } from "./LoginContext";
import fbConfig from "../firebaseconfig.json";

const INITIAL_STATE = [];

const taskReducer = (state, action) => {
  switch (action.type) {
    case "init":
      return action.payload.dataSet;
    case "adjust": {
      let adjustedTasks = [...state];
      const taskIndex = adjustedTasks.findIndex((item) => {
        return item.id === action.payload.taskID;
      });
      let adjustedTask = adjustedTasks[taskIndex];
      adjustedTask.description = action.payload.description;
      adjustedTask.title = action.payload.title;
      adjustedTasks[taskIndex] = adjustedTask;
      return adjustedTasks;
    }
    case "add": {
      let adjustedTasks = [...state];
      adjustedTasks.push({
        id: action.payload.id,
        title: action.payload.title,
        description: action.payload.description,
        dateAdded: action.payload.dateAdded,
      });
      return adjustedTasks;
    }
    case "remove": {
      let adjustedTasks = [...state];
      const taskIndex = adjustedTasks.findIndex((item) => {
        return item.id === action.payload;
      });
      if (taskIndex) adjustedTasks.splice(taskIndex, 1);
      return adjustedTasks;
    }
    default:
      return state;
  }
};

const TaskContext = createContext({
  taskState: INITIAL_STATE,
  addTask: () => {},
  adjustTask: () => {},
  removeTask: () => {},
  markCompleted: () => {},
});

const TaskProvider = (props) => {
  const [taskState, taskDispatch] = useReducer(taskReducer, INITIAL_STATE);
  const loginState = useContext(LoginContext).sessionState;

  const addTask = async (taskTitle, taskDescription) => {
    const today = new Date();
    const dateAdded =
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

    const req = await fetch(
      fbConfig.databaseURL + "/" + loginState.uid + "/notes.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          dateAdded: dateAdded,
          completed: false,
        }),
      }
    );

    if (!req.ok) {
      return { code: 2, msg: req.statusText };
    }
    const resp = await req.json();
    taskDispatch({
      type: "add",
      payload: {
        id: resp.name,
        title: taskTitle,
        description: taskDescription,
        dateAdded,
      },
    });
    return { code: 1, msg: "Success" };
  };

  const adjustTask = async (taskObj) => {
    const req = await fetch(
      fbConfig.databaseURL +
        "/" +
        loginState.uid +
        "/notes/" +
        taskObj.taskID +
        ".json",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskObj.taskTitle,
          description: taskObj.taskDescription,
          dateAdded: taskObj.dateAdded,
          completed: false,
        }),
      }
    );

    if (!req.ok) {
      return { code: req.status, msg: req.statusText };
    }
    // eslint-disable-next-line no-unused-vars
    const resp = await req.json();
    taskDispatch({
      type: "adjust",
      payload: {
        taskID: taskObj.taskID,
        description: taskObj.taskDescription,
        title: taskObj.taskTitle,
      },
    });
    return { code: 1, msg: "Success" };
  };

  const markCompleted = async (taskObj) => {
    const req = await fetch(
      fbConfig.databaseURL +
        "/" +
        loginState.uid +
        "/notes/" +
        taskObj.taskID +
        ".json",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskObj.taskTitle,
          description: taskObj.taskDescription,
          dateAdded: taskObj.dateAdded,
          completed: true,
        }),
      }
    );

    if (!req.ok) {
      return { code: 2, msg: req.statusText };
    }
    // eslint-disable-next-line no-unused-vars
    const resp = await req.json();
    taskDispatch({ type: "remove", payload: taskObj.taskID });
    return { code: 1, msg: "Success" };
  };

  useEffect(() => {
    const fetchList = async () => {
      const req = await fetch(
        fbConfig.databaseURL + "/" + loginState.uid + "/notes/.json"
      );
      const data = await req.json();
      let dataArray = [];
      if (!data) taskDispatch({ type: "init", payload: { dataSet: [] } });
      else {
        Object.keys(data).forEach((item) => {
          if (!data[item].completed)
            dataArray.push({
              id: item,
              title: data[item].title,
              description: data[item].description,
              dateAdded: data[item].dateAdded,
            });
        });
        if (dataArray.length === 0) console.log("No data fetched");
        else {
          console.log("Data fetched");
          taskDispatch({ type: "init", payload: { dataSet: dataArray } });
        }
      }
    };
    if (loginState.uid);
    fetchList();
  }, [loginState]);

  const value = {
    taskState,
    adjustTask,
    addTask,
    markCompleted,
  };

  return (
    <TaskContext.Provider value={value}>{props.children}</TaskContext.Provider>
  );
};

export default TaskProvider;
export { TaskContext };
