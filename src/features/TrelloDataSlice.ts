import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../Store/store";

interface TrelloState {
  boards: Board[];
  loading: boolean;
  error: string | null;
  cards: Cards[];
  lists: List[];
}

export interface Cards {
  id: string;
  name: string;
  listId: string;
}

interface List {
  id: string;
  name: string;
  boardId: string;
  cardIds: string[];
}

interface Board {
  id: string;
  name: string;
  listIds: string[];
  lists: string[];
}

const initialState: TrelloState = {
  boards: [],
  loading: false,
  error: null,
  cards: [],
  lists: [],
};

const APIKey = "3685b75fa9e12796a15db0b2ca8a0b55";
const APIToken =
  "ATTA592612972790619de325103dddafc4e55f7f35faabf736efd4f3b353d7e34c951047D34B";

/*======================================= Board CRUD =======================================*/
//Create Board
export const createBoard = createAsyncThunk(
  "trello/addBoard",
  async (boardName: string) => {
    try {
      const apiBoardPost = `https://api.trello.com/1/boards/?&name=${boardName}&defaultLists=false&key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiBoardPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: boardName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to add board");
    }
  }
);

//Read Board
export const fetchTrelloData = () => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const apiURL = `https://api.trello.com/1/members/me/boards?key=${APIKey}&token=${APIToken}`;
    const response = await fetch(apiURL);
    const data = await response.json();
    dispatch(setBoards(data));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError("Failed to fetch Trello data"));
  } finally {
    dispatch(setLoading(false));
  }
};

//Update Board
export const updateBoardName =
  (boardId: any, name: any) => async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const apiUpdateBoard = `https://api.trello.com/1/boards/${boardId}?name=${name}&key=${APIKey}&token=${APIToken}`;
      await fetch(apiUpdateBoard, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      dispatch(fetchTrelloData());
    } catch (error) {
      dispatch(setError("Failed to update board"));
    } finally {
      dispatch(setLoading(false));
    }
  };

//Delete Board
export const deleteBoard = (id: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const apiDelete = `https://api.trello.com/1/boards/${id}?key=${APIKey}&token=${APIToken}`;
    await fetch(apiDelete, {
      method: "DELETE",
    });
    dispatch(fetchTrelloData());
  } catch (error) {
    dispatch(setError("Failed to delete board"));
  } finally {
    dispatch(setLoading(false));
  }
};
/*=========================================================================================*/

/*======================================= List CRUD =======================================*/

//Create List
export const addListToBoard = createAsyncThunk(
  "trello/addListToBoard",
  async ({ boardId, listName }: { boardId: string; listName: string }) => {
    try {
      const apiListPost = `https://api.trello.com/1/boards/${boardId}/lists?name=${listName}&key=${APIKey}&token=${APIToken}`;

      const response = await fetch(apiListPost, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: listName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to add list");
    }
  }
);

//Read Lists
export const fetchLists =
  (boardId: any) => async (dispatch: any, getState: any) => {
    try {
      dispatch(setLoading(true));

      const apiLists = `https://api.trello.com/1/boards/${boardId}/lists?key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiLists);
      const data = await response.json();
      const { boards } = getState().trello;
      const board = boards.find((board: any) => board.id === boardId);

      if (board) {
        const updatedBoard = {
          ...board,
          lists: data,
        };
        dispatch(updateBoard(updatedBoard));
      }
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError("Failed to fetch lists"));
    } finally {
      dispatch(setLoading(false));
    }
  };

//Update List
export const updateList = createAsyncThunk(
  "trello/updateList",
  async ({ listId, listName }: { listId: string; listName: string }) => {
    try {
      const apiUpdateList = `https://api.trello.com/1/lists/${listId}?name=${listName}&key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiUpdateList, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: listName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to update list");
    }
  }
);

//Archive List === (Delete List)
export const archiveList = createAsyncThunk(
  "trello/updateList",
  async (listId: string) => {
    try {
      const apiArchiveList = `https://api.trello.com/1/lists/${listId}?closed=true&key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiArchiveList, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to update list");
    }
  }
);

/*=========================================================================================*/

/*======================================= Cards CRUD =======================================*/
//Create Card
export const createCard = createAsyncThunk(
  "trello/createCard",
  async ({ listId, cardName }: { listId: string; cardName: string }) => {
    try {
      const apiAddCard = `https://api.trello.com/1/cards?idList=${listId}&name=${cardName}&key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiAddCard, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cardName }),
      });
      const newCard = await response.json();

      return newCard;
    } catch (error) {
      throw new Error("Failed to create card");
    }
  }
);

//Read Cards
export const fetchCards = createAsyncThunk(
  "trello/fetchCards",
  async (boardId: any) => {
    try {
      const apiCards = `https://api.trello.com/1/boards/${boardId}/cards?key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiCards);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to fetch cards");
    }
  }
);

//Update Card
export const updateCardList = createAsyncThunk(
  "trello/updateCardList",
  async ({ cardId, newListId }: { cardId: string; newListId: string }) => {
    try {
      const apiUpdateCardList = `https://api.trello.com/1/cards/${cardId}?idList=${newListId}&key=${APIKey}&token=${APIToken}`;
      const response = await fetch(apiUpdateCardList, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listId: newListId }),
      });
      const updatedCard = await response.json();

      return updatedCard;
    } catch (error) {
      throw new Error("Failed to update card list");
    }
  }
);

//Delete Card
export const deleteCard = createAsyncThunk(
  "trello/deleteCard",
  async (cardId: string) => {
    try {
      const apiCardDelete = `https://api.trello.com/1/cards/${cardId}?key=${APIKey}&token=${APIToken}`;
      await fetch(apiCardDelete, {
        method: "DELETE",
      });
      return cardId;
    } catch (error) {
      throw new Error("Failed to delete card");
    }
  }
);

/*=========================================================================================*/

const trelloSlice = createSlice({
  name: "trello",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    updateBoard: (state, action: PayloadAction<any>) => {
      const { payload } = action;
      const boardIndex = state.boards.findIndex(
        (board) => board.id === payload.id
      );
      if (boardIndex !== -1) {
        state.boards[boardIndex] = payload;
      }
    },
    addBoard: (state, action: PayloadAction<any>) => {
      state.boards.push(action.payload);
    },
    updateBoardList: (
      state,
      action: PayloadAction<{ boardId: string; list: any }>
    ) => {
      const { boardId, list } = action.payload;
      const boardIndex = state.boards.findIndex(
        (board) => board.id === boardId
      );
      if (boardIndex !== -1) {
        state.boards[boardIndex].lists.push(list);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.boards.push(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add board";
      })
      .addCase(addListToBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addListToBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.lists.push(action.payload); // Add the new list to the state
      })
      .addCase(addListToBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add list";
      })
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cards";
      })
      .addCase(createCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        const newCard = action.payload;
        state.cards.push(newCard);

        const list = state.lists.find((list) => list.id === newCard.listId);
        if (list) {
          list.cardIds.push(newCard.id);
        }

        state.loading = false;
        state.error = null;
      })
      .addCase(createCard.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        const cardId = action.payload;
        state.cards = state.cards.filter((card) => card.id !== cardId);

        const list = state.lists.find((list) => list.cardIds.includes(cardId));
        if (list) {
          list.cardIds = list.cardIds.filter((id) => id !== cardId);
        }

        state.loading = false;
        state.error = null;
      })
      .addCase(updateCardList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCardList.fulfilled, (state, action) => {
        const updatedCard = action.payload;
        const existingCardIndex = state.cards.findIndex(
          (card) => card.id === updatedCard.id
        );

        if (existingCardIndex !== -1) {
          state.cards[existingCardIndex] = updatedCard;
        }
        state.loading = false;
        state.error = null;
      });
  },
});

export const selectCardsByListId = (listId: string) => (state: RootState) =>
  state.trello.cards.filter((card: any) => card.listId === listId);
export const { setLoading, setBoards, setError, updateBoardList, updateBoard } =
  trelloSlice.actions;
export default trelloSlice.reducer;
