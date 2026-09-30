import { createSlice } from '@reduxjs/toolkit';

// 1. Define the initial state
const initialState = {
   items : []
};

// 2. Create the slice
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
      // what action do we need 
  },
});

// 3. Export the auto-generated action creators
export const {  } = postSlice.actions;

// 4. Export the reducer to be added to the store
export default postSlice.reducer;