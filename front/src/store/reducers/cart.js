import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    deleteItem: (state, action) => {
      const newItems = state.items.filter((e) => e.id !== action?.payload?.id);
      return { ...state, items: newItems };
    },
    add: (state, action) => {
      if (action?.payload?.id) {
        const newItems = [
          ...state.items.filter((i) => i.id !== action.payload.id),
          action.payload,
        ];
        return { ...state, items: newItems };
      }
      return { ...state };
    },
    edit: (state, action) => {
      const { id, quantity } = action.payload;
      const newItems = state.items.map((e) => {
        if (e.id === id) {
          return { ...e, quantity:Math.max(1,quantity) };
        }
        return e;
      });
      return { ...state, items: newItems };
    },
  },
});

export const { deleteItem, add, edit } = cartSlice.actions;

export const cart = (state) => state.cart;

export default cartSlice.reducer;
