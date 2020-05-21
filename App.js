import React from 'react';
import styles from './styles'


import reducers from './redux/reducers'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import Login from './screens/Login';

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducers, middleware)


export default function App() {
  return (
      <Provider store={store}>
        <Login />
      </Provider>
  );
}