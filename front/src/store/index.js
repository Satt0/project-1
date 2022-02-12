import { configureStore } from '@reduxjs/toolkit';

import userSlice from './reducers/user'
import  cartSlice  from './reducers/cart';
export const store = configureStore({
  reducer: {user:userSlice,cart:cartSlice},
})