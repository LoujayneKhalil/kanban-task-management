import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import "../Components/ModalStyle.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { RootState, store } from "../Store/store";
import { closeTaskModal } from "../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { createCard } from "../features/TrelloDataSlice";
import { registerSchema } from "../schema/formSchema";

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
  const [listId, setListId] = React.useState("");
  const [cardName, setCardName] = React.useState("");

  const { selectedBoardId } = useSelector((state: RootState) => state.board);

  const { boards } = useSelector((state: RootState) => state.trello);
  const getSelectedBoard = boards.find((board) => board.id === selectedBoardId);

  const isTaskModalOpen = useSelector(
    (state: RootState) => state.modal.isTaskModalOpen
  );

  const handleClose = () => dispatch(closeTaskModal());

  const labelClassName = `${theme === "dark" ? "dark-label" : "light-label"}`;

  const handleCardNameChange = (e: any) => {
    setCardName(e.target.value);
  };

  const handleListSelect = (e: any) => {
    setListId(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = (listId: any) => {
    store.dispatch(createCard({ listId: listId, cardName }));
    setCardName("");
    handleClose();
  };

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
          component="form"
          onSubmit={handleSubmit(()=>onSubmit(listId))}
        >
          <Typography variant="h6" sx={{ fontWeight: "700", fontSize: "18px" }}>
            Add New Task
          </Typography>
          <div className="modal-wrapper">
            <label className={labelClassName} htmlFor="title">
              Title
            </label>
            <TextField
              {...register('title')}
              name="title"
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="e.g. Take coffee break"
              id="title"
              variant="outlined"
              size="small"
              value={cardName}
              onChange={handleCardNameChange}
              InputProps={{
                style: {
                  ...placeholderStyle,
                  color: theme === "dark" ? "#fff" : "#000112",
                },
              }}
            />

            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <label className={labelClassName} htmlFor="Status">
                Status
              </label>
              <Select
                {...register("lists")}
                name="lists"
                labelId="lists-label"
                error={!!errors.lists}
                id="lists"
                value={listId}
                onChange={handleListSelect}
                sx={{ color: theme === "dark" ? "white" : "black" }}
              >
                {getSelectedBoard?.lists
                  ? getSelectedBoard?.lists.map((list: any, index: number) => {
                      return (
                        <MenuItem
                          key={index}
                          value={list.id}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {list.name}
                        </MenuItem>
                      );
                    })
                  : null}
              </Select>
              {errors.lists && <span style={{fontSize:'12px',margin:'6px 15px',color:'#d32f2f'}}>{errors.lists.message}</span>}
            </FormControl>
            <button
              className="create-task"
              type="submit"
            >
              Create Task
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
