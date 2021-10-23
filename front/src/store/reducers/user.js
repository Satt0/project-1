import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 id:-1,
 role:-1,
 authenticated:false,
 restored:false,
 username:""
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (_, action) => {
      return {...action.payload,restored:true,authenticated:true}
    },
    logout: (state, _) => {
     state={...initialState} 
    }
  }
});

export const { login, logout } = userSlice.actions;

export const user = (state) => state.user;

export default userSlice.reducer;