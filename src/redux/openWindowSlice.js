import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    openWindow: false
};

const settingsSlice = createSlice({
    name: "openWindow",
    initialState,
    reducers: {
        setOpenWindow(state, action) {
            state.openWindow = action.payload;
        }
    }
});

export const { setOpenWindow } = settingsSlice.actions;

export default settingsSlice.reducer;