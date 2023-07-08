import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TrelloState {
  boards: any[];
  loading: boolean;
  error: string | null;
}

interface Card {
  id: string;
  name: string;
}

interface List {
  id: string;
  name: string;
  cards: Card[];
}

interface Board {
  id: string;
  name: string;
  lists: List[];
}

const initialState: TrelloState = {
  boards: [],
  loading: false,
  error: null,
};

const APIKey = "3685b75fa9e12796a15db0b2ca8a0b55";
const APIToken =
  "ATTA592612972790619de325103dddafc4e55f7f35faabf736efd4f3b353d7e34c951047D34B";

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

export const createBoard = (board: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const apiBoardPost = `https://api.trello.com/1/boards/?name=${board.name}&key=${APIKey}&token=${APIToken}`;
    await fetch(apiBoardPost, {
      method: "POST",
      body: JSON.stringify(board),
    });

    dispatch(fetchTrelloData());
  } catch (error) {
    dispatch(setError("Failed to add new board"));
  } finally {
    dispatch(setLoading(false));
  }
};

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

export const listBoard = (boardId: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const apiLists = `https://api.trello.com/1/boards/${boardId}/lists?key=${APIKey}&token=${APIToken}`;
    await fetch(apiLists, {
      method: "DELETE",
    });
    dispatch(fetchTrelloData());
  } catch (error) {
    dispatch(setError("Failed to fetch lists"));
  } finally {
    dispatch(setLoading(false));
  }
};
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
// export const fetchCardsInList =
//   (listId: any) => async (dispatch: any, getState: any) => {
//     try {
//       dispatch(setLoading(true));

//       const apiLists = `https://api.trello.com/1/lists/${listId}/cards?key=${APIKey}&token=${APIToken}`;
//       const response = await fetch(apiLists);
//       const data = await response.json();
//       const { lists } = getState().trello;
//       const list = lists.find((list: any) => list.id === listId);

//       if (list) {
//         const updatedBoard = {
//           ...list,
//           lists: data,
//         };
//         dispatch(updateBoard(updatedBoard));
//       }
//       dispatch(setError(null));
//     } catch (error) {
//       dispatch(setError("Failed to fetch lists"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

export const fetchCards = (listId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    
    const apiCards = `https://api.trello.com/1/lists/${listId}/cards?key=${APIKey}&token=${APIToken}`;
    const response = await fetch(apiCards);
    const data = await response.json();

    dispatch(updateListCards({ listId, cards: data }));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch cards'));
    dispatch(setLoading(false));
  }
};

export const addList = (list: any) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const apiListPost = `https://api.trello.com/1/lists?name=${list.name}&idBoard=5abbe4b7ddc1b351ef961414&key=${APIKey}&token=${APIToken}`;

    await fetch(apiListPost, {
      method: "POST",
      body: JSON.stringify(list),
    });

    dispatch(fetchTrelloData());
  } catch (error) {
    dispatch(setError("Failed to add new List"));
  } finally {
    dispatch(setLoading(false));
  }
};

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
    updateListCards: (
      state,
      action: PayloadAction<{ listId: string; cards: Card[] }>
    ) => {
      const { listId, cards } = action.payload;
      const lists = state.boards.flatMap((board) => board.lists);
      const list = lists.find((list) => list.id === listId);
      if (list) {
        list.cards = cards;
      }
    },
  },
});

export const {
  setLoading,
  setBoards,
  setError,
  addBoard,
  updateBoardList,
  updateBoard,
  updateListCards,
} = trelloSlice.actions;
export default trelloSlice.reducer;
