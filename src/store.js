import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers';
import ReduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const logger = createLogger();

const middleware = [ReduxThunk, logger];

const store = createStore(
        persistedReducer,
        applyMiddleware(...middleware),
);

const persistor = persistStore(store);

export {store, persistor};