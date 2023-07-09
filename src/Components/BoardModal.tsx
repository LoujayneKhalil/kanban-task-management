import * as React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../schema/formSchema";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import "../Components/ModalStyle.css";
import { RootState, store } from "../Store/store";
import { closeBoardModal } from "../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createBoard,
  addListToBoard,
  updateBoardName,
  archiveList,
} from "../features/TrelloDataSlice";
import { selectBoardName } from "../features/boardSlice";

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
  const [listname, setListName] = React.useState("");
  const [listNames, setListNames] = React.useState([""]);
  const { isBoardModalOpen, isBoardEditModal } = useSelector(
    (state: RootState) => state.modal
  );

  const { selectedBoardId, selectedBoardName } = useSelector(
    (state: RootState) => state.board
  );
  const { boards } = useSelector((state: RootState) => state.trello);

  const getSelectedBoard = boards.find((board) => board.id === selectedBoardId);

  const handleClose = () => {
    dispatch(closeBoardModal());
    setNewBoardName("");
  };

  const handleUpdateBoard = (e: any) => {
    e.preventDefault();

    store.dispatch(updateBoardName(selectedBoardId, newBoardName));
    dispatch(selectBoardName(newBoardName));
    setNewBoardName(selectedBoardName);

    handleClose();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newBoardAction = await store.dispatch(createBoard(newBoardName));
    const newBoard = newBoardAction.payload;

    try {
      await Promise.all(
        listNames.map(async (listName) => {
          await store.dispatch(
            addListToBoard({ boardId: newBoard.id, listName })
          );
        })
      );
    } catch (error) {
      console.error("Failed to create lists:", error);
    }
    handleClose();
  };

  const handleListNameChange = (index: number, e: any) => {
    const updatedListNames = [...listNames];
    updatedListNames[index] = e.target.value;
    setListNames(updatedListNames);
  };

  const handleAddList = () => {
    setListNames([...listNames, ""]);
  };

  const handleDeleteColumn = (listId: any) => {
    store.dispatch(archiveList(listId));
  };

  const handleRemoveColumn = (e: any) => {
    e.target.parentNode.remove();
  };

  const labelClassName = `${theme === "dark" ? "dark-label" : "light-label"}`;

  const {
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

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
          <Typography
            variant="h6"
            sx={{
              fontWeight: "700",
              fontSize: "18px",
              color: theme === "dark" ? "#fff" : "#000112",
            }}
          >
            {isBoardEditModal ? "Edit Board" : "Add New Board"}
          </Typography>
          <div className="modal-wrapper">
            <label className={labelClassName} htmlFor="title">
              Name
            </label>
            <TextField
              {...register("title")}
              name="title"
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="e.g. Web Design"
              id="outlined-basic"
              variant="outlined"
              size="small"
              value={isBoardEditModal ? newBoardName : null}
              onChange={(e) => setNewBoardName(e.target.value)}
              InputProps={{
                style: {
                  ...placeholderStyle,
                  color: theme === "dark" ? "#fff" : "#000112",
                },
              }}
            />
            <label className={labelClassName} htmlFor="Subtasks">
              Columns
            </label>
            <div className="subtask-list">
              {isBoardEditModal
                ? getSelectedBoard?.lists
                  ? getSelectedBoard?.lists.map((list: any, index: number) => (
                      <div key={list.id} className="subtask">
                        <TextField
                          {...register("column")}
                          name="column"
                          error={!!errors.column}
                          helperText={errors.column?.message}
                          placeholder="e.g. Submit the task"
                          value={list.name}
                          id={list.id}
                          variant="outlined"
                          size="small"
                          sx={{ width: "100%" }}
                          onChange={(e) =>
                            handleListNameChange(index, e)
                          }
                          InputProps={{
                            style: {
                              ...placeholderStyle,
                              color: theme === "dark" ? "#fff" : "#000112",
                            },
                          }}
                        />
                        <span
                          className="x-delete fa-solid fa-xmark fa-lg"
                          id={list.id}
                          onClick={() =>
                            handleDeleteColumn(
                              isBoardEditModal ? list.id : null
                            )
                          }
                        ></span>
                      </div>
                    ))
                  : null
                : listNames.map((listName, index) => (
                    <div key={index} className="subtask">
                      <TextField
                        {...register("column")}
                        name="column"
                        error={!!errors.column}
                        helperText={errors.column?.message}
                        placeholder="e.g. Submit the task"
                        value={listName}
                        variant="outlined"
                        size="small"
                        sx={{ width: "100%" }}
                        onChange={(e) =>
                          handleListNameChange(index, e)
                        }
                        InputProps={{
                          style: {
                            ...placeholderStyle,
                            color: theme === "dark" ? "#fff" : "#000112",
                          },
                        }}
                      />
                      <span
                        className="x-delete fa-solid fa-xmark fa-lg"
                        id={listName}
                        onClick={handleRemoveColumn}
                      ></span>
                    </div>
                  ))}
            </div>
            <button
              className={`add-subtask ${
                theme === "dark" ? "darkMode" : "lightMode"
              }`}
              onClick={isBoardEditModal ? (e) => console.log(e) : handleAddList}
              style={{ display: isBoardEditModal ? "none" : "block" }}
            >
              + Add New Column
            </button>
            <button
              className="create-task"
              onClick={isBoardEditModal ? handleUpdateBoard : handleSubmit}
            >
              {isBoardEditModal ? "Save Board" : "Create New Board Task"}
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
