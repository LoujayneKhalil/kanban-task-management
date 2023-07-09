import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BoardState {
  selectedBoardId: any | null;
  selectedBoardName: any | null;
  selectedCardId: any | null;
}

const initialState: BoardState = {
  selectedBoardId: "64a68950866c68201ea44375",
  selectedBoardName: "Marketing Plan",
  selectedCardId: "",
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    selectBoardId: (state, action: PayloadAction<string>) => {
      state.selectedBoardId = action.payload;
    },
    clearSelectedBoardId: (state) => {
      state.selectedBoardId = null;
    },
    selectBoardName: (state, action: PayloadAction<string>) => {
      state.selectedBoardName = action.payload;
    },
    clearSelectedBoardName: (state) => {
      state.selectedBoardName = null;
    },
    setCardId: (state, action: PayloadAction<any>) => {
      state.selectedCardId = action.payload;
    },
    clearSelectedCardId: (state) => {
      state.selectedCardId = null;
    },
  },
});

export const {
  selectBoardId,
  clearSelectedBoardId,
  selectBoardName,
  clearSelectedBoardName,
  setCardId,
  clearSelectedCardId,
} = boardSlice.actions;
export default boardSlice.reducer;
