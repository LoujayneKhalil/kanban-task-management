import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../Components/ModalStyle.css";
import { RootState, store } from "../Store/store";
import { closeDeleteModal } from "../features/modalSlice";
import { deleteBoard } from "../features/TrelloDataSlice";
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

export default function DeleteModal() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const isDeleteModalOpen = useSelector(
    (state: RootState) => state.modal.isDeleteModalOpen
  );

  const selectedBoardId = useSelector((state:RootState)=>state.board.selectedBoardId)

  //   console.log(props.boardId)

  const handleClose = () => dispatch(closeDeleteModal());

  const handleDeleteBoard = (boardId: any) => {
    store.dispatch(deleteBoard(boardId));
    handleClose();
  };

  return (
    <div>
      <Modal
        open={isDeleteModalOpen}
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
            sx={{ fontWeight: "700", fontSize: "18px", color: "#EA5555" }}
          >
            Delete this board?
          </Typography>
          <Typography
            paragraph
            sx={{ fontSize: "13px", mt: 2, color: "#828FA3" }}
          >
            Are you sure you want to delete the ‘Platform Launch’ board? This
            action will remove all columns and tasks and cannot be reversed.
          </Typography>
          <div className="delete-wrapper">
            <button
              className={`delete-btn`}
              onClick={() => handleDeleteBoard(selectedBoardId)}
            >
              Delete
            </button>
            <button
              className={`${
                theme === "dark"
                  ? "darkMode-cancel-btn"
                  : "lightMode-cancel-btn"
              }`}
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
