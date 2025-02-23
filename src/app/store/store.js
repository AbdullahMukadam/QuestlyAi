import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage for persistence
import { combineReducers } from 'redux';

import AuthSlice from './AuthSlice';
import UserDataSlice from './UserDataSlice';
import InterviewQuestionSlice from './InterviewQuestionSlice';

// Persist Config
const persistConfig = {
    key: 'root',
    storage, 
    whitelist: ['userData'] // Only persist the userData slice
};

// Combine Reducers
const rootReducer = combineReducers({
    auth: AuthSlice,
    userData: persistReducer(persistConfig, UserDataSlice), // Persist userData
    interview: InterviewQuestionSlice
});

// Create Store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Prevents errors due to non-serializable values
        }),
});

// Persistor
export const persistor = persistStore(store);
