import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import "../Components/ModalStyle.css";
import { RootState, store } from "../Store/store";
import { closeBoardModal } from "../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { createBoard, addList } from "../features/TrelloDataSlice";

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
  fontWeight: "500",
  lineHeight: "23px",
};

export default function BoardModalPopUp() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const [newBoardName, setNewBoardName] = React.useState("");
  const [listNames, setListNames] = React.useState<string[]>(["Todo", "Doing"]);
  const [newListName, setNewListName] = React.useState("");

  const isBoardModalOpen = useSelector(
    (state: RootState) => state.modal.isBoardModalOpen
  );

  const handleClose = () => dispatch(closeBoardModal());

  const handleAddBoard = async () => {
    if (newBoardName.trim() !== "") {
      const newBoard = {
        name: newBoardName,
        lists: [],
      };

      const createdBoard: any = await store.dispatch(createBoard(newBoard));
      if (createdBoard) {
        listNames.forEach(async (listName: any) => {
          const newList = {
            name: listName,
          };
          await store.dispatch(addList(newList));
        });
      }

      setNewBoardName("");
    }
    handleClose();
  };
  const handleAddList = () => {
    setListNames((prevListNames) => [...prevListNames, newListName]);
    setNewListName("");
  };

  const handleDeleteColumn = (e: any) => {
    e.target.parentNode.remove();
  };

  const handleListNameChange = (index: number, value: string) => {
    setListNames((prevListNames) =>
      prevListNames.map((name, i) => (i === index ? value : name))
    );
  };
  const taskModel = (isEdit: boolean) => {
    if (isEdit === true) {
      return "Edit Board";
    } else {
      return "Add New Board";
    }
  };

  const labelClassName = `${theme === "dark" ? "dark-label" : "light-label"}`;

  return (
    <div>
      <Modal
        open={isBoardModalOpen}
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
              Name
            </label>
            <TextField
              placeholder="e.g. Web Design"
              id="outlined-basic"
              variant="outlined"
              size="small"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              InputProps={{
                style: placeholderStyle,
              }}
            />
            <label className={labelClassName} htmlFor="Subtasks">
              Columns
            </label>
            <div className="subtask-list">
              {listNames.map((listName, index) => (
                <div key={index} className="subtask">
                  <TextField
                    value={listName}
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    sx={{ width: "100%" }}
                    onChange={(e) =>
                      handleListNameChange(index, e.target.value)
                    }
                    InputProps={{
                      style: placeholderStyle,
                    }}
                  />
                  <span
                    className="x-delete fa-solid fa-xmark fa-lg"
                    onClick={(handleDeleteColumn)}
                  ></span>
                </div>
              ))}
            </div>
            <button
              className={`add-subtask ${
                theme === "dark" ? "darkMode" : "lightMode"
              }`}
              onClick={handleAddList}
            >
              + Add New Column
            </button>
            <button className="create-task" onClick={handleAddBoard}>
              Create New Board Task
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
