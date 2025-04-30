import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({user: userReducer});

// persistConfig will set the name storage and version in local storage
const persistConfig ={
    key: 'root',
    storage,
    version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    // set serializableCheck to false so we don't get error for non
  // serialized variables 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }), 
});

// make the store persist
export const persistor = persistStore(store);