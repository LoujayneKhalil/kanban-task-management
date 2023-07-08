import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircleIcon from "@mui/icons-material/Circle";
import "./BoardsStyle.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, store } from "../Store/store";
import { fetchCards, fetchLists } from "../features/TrelloDataSlice";
import { clearSelectedBoardName } from "../features/boardSlice";

export default function Boards() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  // const [listId, setListId] = React.useState("64a41ca1d322af762551caec");

  const selectedBoardId = useSelector(
    (state: RootState) => state.board.selectedBoardId
  );
  const { boards } = useSelector((state: RootState) => state.trello);

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  React.useEffect(() => {
    store.dispatch(fetchLists(selectedBoardId));
  }, [selectedBoardId]);

  // React.useEffect(() => {
  //   if (selectedBoard) {
  //     const fetchAllCards = async () => {
  //       for (const list of selectedBoard.lists) {
  //         await store.dispatch(fetchCards(list.id));
  //       }
  //     };

  //     fetchAllCards();
  //   }
  // }, [selectedBoard]);

  if (!selectedBoard) {
    dispatch(clearSelectedBoardName());
    return <div>Board not found.</div>;
  }

  return (
    <div className="board-wrapper">
      <Box sx={{ width: "auto", mt: 10 }}>
        <div style={{ display: "flex", gap: "20px" }}>
          {selectedBoard.lists ? (
            selectedBoard.lists.map((list: any) => (
              <Grid
                item
                xs={3}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                key={list.id}
              >
                <div className="list-header-wrapper">
                  <CircleIcon fontSize="small" sx={{ color: "#49C4E5" }} />
                  <p className="list-header">{list.name} (5)</p>
                </div>
                {/* {
                  list.cards
                } */}
                <Card
                  sx={{
                    minWidth: 280,
                    backgroundColor: theme === "dark" ? "#364E7E1A" : "#fff",
                  }}
                >
                  <CardContent>
                    <p className="task-name">Build UI for onboarding flow</p>
                    <p className="subtasks">0 of 3 substasks </p>{" "}
                  </CardContent>
                </Card>
              </Grid>
            ))
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
                }}
              >
                + Add New Column
              </Button>
            </div>
          )}
          <button
            className="new-column-btn"
            style={{
              display: selectedBoard.lists ? "block" : "none",
              backgroundColor: theme === "dark" ? "#2B2C3740" : "#E9EFFA",
            }}
          >
            + New Column
          </button>
        </div>
      </Box>
    </div>
  );
}
