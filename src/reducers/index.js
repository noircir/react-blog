import { combineReducers } from 'redux';
import postsReducer from './postsReducer';
import usersReducer from './usersReducer';

export default combineReducers({
    // replaceMe: () => 10 // dummy reducer to get the app working
    posts: postsReducer,
    users: usersReducer
});