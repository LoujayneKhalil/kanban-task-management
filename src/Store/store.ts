import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/themeSlice";
import modalReducer from "../features/modalSlice";
import trelloReducer from "../features/TrelloDataSlice";
import boardReducer from '../features/boardSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    modal: modalReducer,
    trello: trelloReducer,
    board: boardReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
