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
import { closeNewColumnModal } from "../features/modalSlice";
import { addListToBoard } from "../features/TrelloDataSlice";
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
  fontWeight: "500",
  lineHeight: "23px",
};

export default function NewColumnModal() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const [newList, setNewList] = React.useState<string>("");

  const { selectedBoardId } = useSelector((state: RootState) => state.board);

  const isNewColumnModalOpen = useSelector(
    (state: RootState) => state.modal.isNewColumnModalOpen
  );

  const handleClose = () => {
    dispatch(closeNewColumnModal());
  };

  const {
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const handleNewListSubmit = () => {
    store.dispatch(
      addListToBoard({ boardId: selectedBoardId, listName: newList })
    );
    setNewList("");
    handleClose();
  };

  return (
    <div>
      <Modal
        open={isNewColumnModalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          component="form"
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
            Add New Column
          </Typography>
          <TextField
            {...register("title")}
            name="title"
            error={!!errors.title}
            helperText={errors.title?.message}
            placeholder="e.g. Web Design"
            id="outlined-basic"
            variant="outlined"
            size="small"
            value={newList}
            sx={{ width: "100%", my: 3 }}
            onChange={(e) => setNewList(e.target.value)}
            InputProps={{
              style: {
                ...placeholderStyle,
                color: theme === "dark" ? "#fff" : "#000112",
              },
            }}
          />
          <div>
            <button className={`create-newColumn-btn`} onClick={handleNewListSubmit}>
              Create New Column
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
