import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    errorWindowMsg: ""
};

const settingsSlice = createSlice({
    name: "errorWindowMsg",
    initialState,
    reducers: {
        setErrorWindowMsg(state, action) {
            state.errorWindowMsg = action.payload;
        }
    }
});

export const { setErrorWindowMsg } = settingsSlice.actions;

export default settingsSlice.reducer;