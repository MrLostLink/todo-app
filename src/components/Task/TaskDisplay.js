import { useHistory } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

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
    <Card sx={{ width: 270 }}>
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          {props.dateAdded}
        </Typography>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2">{props.description}</Typography>
      </CardContent>
      <CardActions>
        <Grid container direction="row" justifyContent="space-between">
          <Button
            onClick={completedHandler}
            disabled={buttonState}
            color="success"
          >
            Mark Completed
          </Button>
          <IconButton color="primary" onClick={editHandler}>
            <EditIcon />
          </IconButton>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default TaskDisplay;
