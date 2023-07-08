import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isTaskModalOpen: boolean;
  isBoardModalOpen: boolean;
  isTaskEditModal: boolean;
  isBoardEditModal: boolean;
  isDeleteModalOpen: boolean;
}

const initialState: ModalState = {
  isTaskModalOpen: false,
  isBoardModalOpen: false,
  isTaskEditModal: false,
  isBoardEditModal: false,
  isDeleteModalOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openTaskModal: (state) => {
      state.isTaskModalOpen = true;
    },
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
    },
    openBoardModal: (state) => {
      state.isBoardModalOpen = true;
    },
    closeBoardModal: (state) => {
      state.isBoardModalOpen = false;
    },
    editTaskModal: (state) => {
      state.isTaskEditModal = true;
    },
    editBoardModal: (state) => {
      state.isBoardEditModal = true;
    },
    openDeleteModal: (state) => {
      state.isDeleteModalOpen = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
    },
  },
});

export const {
  openTaskModal,
  closeTaskModal,
  openBoardModal,
  closeBoardModal,
  editBoardModal,
  editTaskModal,
  openDeleteModal,
  closeDeleteModal,
} = modalSlice.actions;
export default modalSlice.reducer;
