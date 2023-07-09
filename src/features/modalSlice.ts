import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isTaskModalOpen: boolean;
  isBoardModalOpen: boolean;
  isTaskEditModal: boolean;
  isDeleteModalOpen: boolean;
  isCardDeleteModal: boolean;
  isCardModalOpen: boolean;
  isBoardEditModal: boolean;
  isNewColumnModalOpen: boolean;
}

const initialState: ModalState = {
  isTaskModalOpen: false,
  isBoardModalOpen: false,
  isTaskEditModal: false,
  isBoardEditModal: false,
  isDeleteModalOpen: false,
  isCardDeleteModal: false,
  isCardModalOpen: false,
  isNewColumnModalOpen: false,
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
      state.isBoardEditModal = false;
    },
    closeBoardModal: (state) => {
      state.isBoardModalOpen = false;
    },
    editTaskModal: (state) => {
      state.isTaskEditModal = true;
    },
    editBoardModal: (state) => {
      state.isBoardModalOpen = true;
      state.isBoardEditModal = true;
    },
    addBoardModal: (state) => {
      state.isBoardModalOpen = true;
      state.isBoardEditModal = false;
    },
    openDeleteModal: (state) => {
      state.isDeleteModalOpen = true;
      state.isCardDeleteModal = false;
    },
    openCardDeleteModal: (state) => {
      state.isDeleteModalOpen = true;
      state.isCardDeleteModal = true;
    },
    closeDeleteModal: (state) => {
      state.isDeleteModalOpen = false;
    },
    openCardModal: (state) => {
      state.isCardModalOpen = true;
    },
    closeCardModal: (state) => {
      state.isCardModalOpen = false;
    },
    openNewColumnModal: (state) => {
      state.isNewColumnModalOpen = true;
    },
    closeNewColumnModal: (state) => {
      state.isNewColumnModalOpen = false;
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
  openCardDeleteModal,
  closeCardModal,
  closeDeleteModal,
  openCardModal,
  addBoardModal,
  openNewColumnModal,
  closeNewColumnModal,
} = modalSlice.actions;
export default modalSlice.reducer;
