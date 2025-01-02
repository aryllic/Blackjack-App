import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    money: 100000
};

const moneySlice = createSlice({
    name: "money",
    initialState,
    reducers: {
        setMoney(state, action) {
            state.money = action.payload;
        }
    }
});

export const { setMoney } = moneySlice.actions;

export default moneySlice.reducer;