/* eslint-disable array-callback-return */
import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import CircleIcon from "@mui/icons-material/Circle";
import "./BoardsStyle.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "../Store/store";
import { fetchCards, fetchLists } from "../features/TrelloDataSlice";
import { clearSelectedBoardName } from "../features/boardSlice";
import { openCardModal, openNewColumnModal } from "../features/modalSlice";
import CardModal from "../Components/CardModal";
import NewColumnModal from "./NewColumnModal";
import DeleteModal from "./DeleteModal";

export default function Boards() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const [selectedCardId, setSelectedCardId] = React.useState<string>("");

  const { selectedBoardId , selectedBoardName} = useSelector(
    (state: RootState) => state.board
  );
  const { boards, cards } = useSelector((state: RootState) => state.trello);
  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  React.useEffect(() => {
    store.dispatch(fetchCards(selectedBoardId));
  }, [selectedBoardId]);
  React.useEffect(() => {
    if (selectedBoard) {
      store.dispatch(fetchLists(selectedBoard.id));
    }
  }, [selectedBoard]);

  if (!selectedBoard) {
    dispatch(clearSelectedBoardName());
    return <div>Board not found.</div>;
  }

  const handleCardOpen = (cardId: any) => {
    setSelectedCardId(cardId);
    dispatch(openCardModal());
  };

  const handleNewColumnOpen = () => {
    dispatch(openNewColumnModal());
  };

  return (
    <div>
      <div className="board-wrapper">
        <Box sx={{ width: "auto", mt: 10 }}>
          <div style={{ display: "flex", gap: "20px" }}>
            {selectedBoardName ? (
              selectedBoard.lists ? (
                selectedBoard.lists.map((list: any) => {
                  let listLength = 0;
                  cards.forEach((card: any) => {
                    if (card.idList === list.id) {
                      listLength += 1;
                    }
                  });

                  return (
                    <div className="grid" key={list.id}>
                      <div className="list-header-wrapper">
                        <CircleIcon
                          fontSize="small"
                          sx={{ color: "#49C4E5" }}
                        />
                        <p className="list-header">
                          {list.name} ({listLength})
                        </p>
                      </div>

                      {cards.map((card: any) => {
                        if (card.idList === list.id) {
                          return (
                            <Card
                              key={card.id}
                              onClick={() => handleCardOpen(card.id)}
                              sx={{
                                minWidth: 280,
                                backgroundColor:
                                  theme === "dark" ? "#364E7E1A" : "#fff",
                              }}
                            >
                              <CardContent>
                                <p className="task-name">{card.name}</p>
                                <p className="subtasks">
                                  0 of 3 substasks{" "}
                                </p>{" "}
                              </CardContent>
                            </Card>
                          );
                        }
                      })}
                    </div>
                  );
                })
              ) : null
            ) : (
              <div
                style={{
                  height: "100%",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "#828FA3",
                    fontSize: "18px",
                    fontWeight: "700",
                  }}
                >
                  This board is empty. Create a new column to get started.
                </p>
                <Button
                  sx={{
                    backgroundColor: "#635FC7",
                    fontSize: "15px",
                    fontWeight: "700",
                    borderRadius: "25px",
                    p: "10px 20px",
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#A8A4FF",
                    },
                    "&:disabled": {
                      backgroundColor: "#d8d7f1",
                      color: "#fff",
                    },
                  }}
                >
                  + Add New Column
                </Button>
              </div>
            )}
            <button
              className={`new-column-btn ${
                theme === "dark" ? "DarkNewCol" : "LightNewCol"
              }`}
              onClick={handleNewColumnOpen}
              style={{ display: selectedBoardName ? "block" : "none" }}
            >
              + New Column
            </button>
          </div>
        </Box>
      </div>

      <CardModal
        selectedBoard={selectedBoard}
        cards={cards}
        selectedCardId={selectedCardId}
      />
      <NewColumnModal />
      <DeleteModal selectedCardId={selectedCardId}/>
    </div>
  );
}
