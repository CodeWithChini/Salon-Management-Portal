import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
  },
  reducers: {
    sidebarToggled(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    sidebarClosed(state) {
      state.sidebarOpen = false;
    },
  },
});

export const { sidebarToggled, sidebarClosed } = uiSlice.actions;
export default uiSlice.reducer;
