/* eslint-disable array-callback-return */
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "../Components/ModalStyle.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { RootState, store } from "../Store/store";
import { closeCardModal, openCardDeleteModal } from "../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { updateCardList } from "../features/TrelloDataSlice";

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

export default function CardModal({
  selectedBoard,
  cards,
  selectedCardId,
}: {
  selectedBoard: any;
  cards: any;
  selectedCardId: any;
}) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuCardOpen = Boolean(anchorEl);
  const [newListId, setNewListId] = React.useState("");

  const isCardModalOpen = useSelector(
    (state: RootState) => state.modal.isCardModalOpen
  );

  const handleClose = () => dispatch(closeCardModal());

  const handleListChange = (cardId: string, e: any) => {
    const newListId = e.target.value;
    setNewListId(newListId);
    store.dispatch(updateCardList({ cardId: cardId, newListId: newListId }));
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteModal = () => {
    dispatch(openCardDeleteModal());
    handleClose();
    handleMenuClose();
  };
  const labelClassName = `${theme === "dark" ? "dark-label" : "light-label"}`;

  return (
    <div>
      <Modal
        open={isCardModalOpen}
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
          <div className="modal-wrapper">
            <div className="card-modal-header">
              {cards.map((card: any) => {
                if (selectedCardId === card.id) {
                  return (
                    <h3
                      key={card.id}
                      style={{ color: theme === "dark" ? "#fff" : "#000112" }}
                    >
                      {card.name}
                    </h3>
                  );
                }
              })}
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon sx={{ color: "#828FA3" }} />
              </IconButton>
            </div>
            <FormControl fullWidth size="small" sx={{ mt: 1 }}>
              <label className={labelClassName} htmlFor="Status">
                Current status
              </label>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={newListId}
                onChange={(e) => handleListChange(selectedCardId, e)}
                sx={{ color: theme === "dark" ? "white" : "black" }}
              >
                {selectedBoard.lists
                  ? selectedBoard.lists.map((list: any, index: number) => {
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
            </FormControl>
          </div>
        </Box>
      </Modal>
      <div className="menu-modal">
        <Menu
          id="basic-menu"
          open={menuCardOpen}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            "& .MuiMenu-paper": {
              backgroundColor: theme === "dark" ? "#20212C" : "#FFF",
            },
          }}
        >
          <MenuItem className="delete-board" onClick={handleDeleteModal}>
            Delete Card
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
