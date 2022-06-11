import { useHistory } from "react-router-dom";

const TaskDisplay = (props) => {

  const navigate = useHistory();

  const buttonHandler = () => {
    navigate.push('/edit/'+ props.id);
  };

  return (
    <tr>
      <td>{props.title}</td>
      <td>{props.description}</td>
      <td>{props.dateAdded}</td>
      <td><button onClick={buttonHandler}>Edit</button></td>
    </tr>
  );
};

export default TaskDisplay;
