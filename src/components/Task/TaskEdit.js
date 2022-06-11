import { Fragment, useContext, useState  } from "react";
import { useParams, useHistory } from "react-router-dom";
import { TaskContext } from "../../context/TaskContext";


const TaskEdit = () => {
    const [errorState, setErrorState] = useState(false);
    const taskID = useParams().taskID;
    const taskContext= useContext(TaskContext);
    const [httpError, setHTTPError] = useState("");
    const [disable, setDisable] = useState(false);
    const navigate = useHistory();

    const pageRedirect = () => {
        navigate.push('/');
    };

    const taskDetails = taskContext.taskState.find((task) => {
        return task.id === taskID;
    });

    const formSubmitHandler = async (event) => {
        setErrorState(false);
        setDisable(true);
        event.preventDefault();
        if(event.target.title.value === "" || event.target.desc.value === "") {
            setDisable(false);
            setErrorState(true);
            return;
        }
        setErrorState(false);
        const resp = await taskContext.adjustTask({taskID, taskTitle: event.target.title.value, taskDescription: event.target.desc.value, dateAdded: taskDetails.dateAdded});
    
        if(resp.code !== 1 ){
            setErrorState(true);
            setHTTPError(resp.code + ': ' + resp.msg);
            setDisable(false);
            return;
        } else {
            setHTTPError("Success! You will now be redirected to the main page...");
            setTimeout(pageRedirect, 3000);
        }
    }

    return(
        <Fragment>
            {!taskDetails && <p>Not found...</p>}
            {taskDetails && 
            <form onSubmit={formSubmitHandler}>
                <input id="task-title" name="title" defaultValue={taskDetails.title}/>
                <input id="task-description" name="desc" defaultValue={taskDetails.description} />
                <input id="task-dateadded" name='dateA' defaultValue={taskDetails.dateAdded} disabled/>
                <button type="submit" disabled={disable}>Submit</button>
            </form>}
            {errorState && httpError === "" && <p>Fields entered cannot be empty</p>}
            {httpError}
        </Fragment>
        
    );
};

export default TaskEdit;