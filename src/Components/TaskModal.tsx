import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import "../Components/ModalStyle.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { RootState } from "../Store/store";
import { closeTaskModal } from "../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
};

const placeholderStyle = {
  fontFamily: "Plus Jakarta Sans",
  fontSize: "13px",
  fontWeight: "700",
  lineHeight: "23px",
};

export default function ModalPopUp() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const isTaskModalOpen = useSelector(
    (state: RootState) => state.modal.isTaskModalOpen
  );
  const [status, setStatus] = React.useState("Todo");

  const handleClose = () => dispatch(closeTaskModal());

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const taskModel = (isEdit: boolean) => {
    if (isEdit === true) {
      return "Edit Task";
    } else {
      return "Add New Task";
    }
  };

  const labelClassName = `${theme === "dark" ? "dark-label" : "light-label"}`;
  // const TextFieldStyle = `${theme==='dark'?''}`

  return (
    <div>
      <Modal
        open={isTaskModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            bgcolor: theme === "dark" ? "#2B2C37" : "background.paper",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "700", fontSize: "18px" }}>
            {taskModel(false)}
          </Typography>
          <div className="modal-wrapper">
            <label className={labelClassName} htmlFor="title">
              Title
            </label>
            <TextField
              placeholder="e.g. Take coffee break"
              id="outlined-basic"
              variant="outlined"
              size="small"
              InputProps={{
                style: placeholderStyle,
              }}
            />
            <label className={labelClassName} htmlFor="description">
              Description
            </label>
            <TextField
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              id="outlined-basic"
              variant="outlined"
              multiline={true}
              rows={4}
              InputProps={{
                style: {...placeholderStyle, color:theme==='dark'?'red': 'blue'}
              }}
            />
            <label className={labelClassName} htmlFor="Subtasks">
              Substasks
            </label>
            <div className="subtask-list">
              <div className="subtask">
                <TextField
                  placeholder="e.g. Make coffee"
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                  InputProps={{
                    style: placeholderStyle,
                  }}
                />
                <span className="x-delete fa-solid fa-xmark fa-lg"></span>
              </div>
              <div className="subtask">
                <TextField
                  placeholder="e.g. Drink coffee & smile "
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                  InputProps={{
                    style: placeholderStyle,
                  }}
                />
                <span className="x-delete fa-solid fa-xmark fa-lg"></span>
              </div>
            </div>
            <button
              className={`add-subtask ${
                theme === "dark" ? "darkMode" : "lightMode"
              }`}
            >
              + Add New Subtask
            </button>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <label className={labelClassName} htmlFor="Status">
                Status
              </label>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                onChange={handleChange}
                sx={{ color: theme === "dark" ? "white" : "black" }}
              >
                <MenuItem value={"Todo"}>Todo</MenuItem>
                <MenuItem value={"Doing"}>Doing</MenuItem>
                <MenuItem value={"Done"}>Done</MenuItem>
              </Select>
            </FormControl>
            <button className="create-task">Create Task</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
