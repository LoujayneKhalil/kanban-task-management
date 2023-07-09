import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../Components/ModalStyle.css";
import { RootState, store } from "../Store/store";
import { closeDeleteModal } from "../features/modalSlice";
import { deleteBoard, deleteCard } from "../features/TrelloDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectBoardId, selectBoardName } from "../features/boardSlice";

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

export default function DeleteModal({
  selectedCardId,
}: {
  selectedCardId: any;
}) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);

  const { isDeleteModalOpen, isCardDeleteModal } = useSelector(
    (state: RootState) => state.modal
  );

  const { selectedBoardId } = useSelector((state: RootState) => state.board);

  const handleClose = () => dispatch(closeDeleteModal());

  const handleDeleteBoard = (boardId: any) => {
    store.dispatch(deleteBoard(boardId));
    dispatch(selectBoardName("Kanban Project"));
    dispatch(selectBoardId("64a9fc88bd117db53fc507ef"));
    handleClose();
  };

  const handleDeleteCard = (cardId: any,e:any) => {
    e.preventDefault();
    store.dispatch(deleteCard(cardId));
    dispatch(selectBoardName("Kanban Project"));
    dispatch(selectBoardId("64a9fc88bd117db53fc507ef"));
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
            Delete this {isCardDeleteModal ? "card" : "board"}?
          </Typography>
          <Typography
            paragraph
            sx={{ fontSize: "13px", mt: 2, color: "#828FA3" }}
          >
            {isCardDeleteModal
              ? "Are you sure you want to delete this card? This action will remove all the subtasks and cannot be reversed."
              : "Are you sure you want to delete this board? This action will remove all columns and tasks and cannot be reversed."}
          </Typography>
          <div className="delete-wrapper">
            <button
              className={`delete-btn`}
              onClick={
                isCardDeleteModal
                  ? (e:any) => handleDeleteCard(selectedCardId,e)
                  : () => handleDeleteBoard(selectedBoardId)
              }
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
