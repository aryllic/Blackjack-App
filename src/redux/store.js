import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moneyReducer from './moneySlice';
import settingsReducer from './settingsSlice';
import openWindowReducer from './openWindowSlice';
import errorWindowMsgReducer from './errorWindowMsgSlice';

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    blacklist: ["openWindow", "errorWindowMsg"]
};

const reducer = combineReducers({
    money: moneyReducer,
    settings: settingsReducer,
    openWindow: openWindowReducer,
    errorWindowMsg: errorWindowMsgReducer
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export const persistor = persistStore(store);