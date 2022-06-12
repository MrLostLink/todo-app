import { useHistory } from "react-router-dom";
import { useState } from "react";
import Button from '@mui/material/Button';

const TaskDisplay = (props) => {
  const navigate = useHistory();
  const [buttonState, setButtonState] = useState(false);

  const editHandler = () => {
    navigate.push("/edit/" + props.id);
  };

  const completedHandler = async () => {
    setButtonState(true);
    const result = await props.completedHandler({
      taskTitle: props.title,
      taskDescription: props.description,
      dateAdded: props.dateAdded,
      taskID: props.id,
    });
    setButtonState(result);
    if (result) navigate.go(0);
  };

  return (
    <tr>
      <td>{props.title}</td>
      <td>{props.description}</td>
      <td>{props.dateAdded}</td>
      <td>
        <Button variant="contained" onClick={editHandler}>Edit</Button>
      </td>
      <td>
        <Button variant="contained" onClick={completedHandler} disabled={buttonState}>
          Mark Completed
        </Button>
      </td>
    </tr>
  );
};

export default TaskDisplay;
