import jsonPlaceholder from '../apis/jsonPlaceholder';
import _ from 'lodash';

//////////////////////////////////////////////////////////////////////
// More traditional approach: fetch all posts, loop over them, 
// find all unique userIds. Then for each userId, do a separate fetch.
//////////////////////////////////////////////////////////////////////

// Calling an action creator from within the action creator. 
// Need to make sure to dispatch the result of action creator 
// for tunk to understand taht it has to do the dispatch.

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    // 'await' to make sure that we are not doing any successive logic
    // until all the posts are fetched.
    await dispatch(fetchPosts());
    // the second argument of redux-thunk is getState
    console.log(getState().posts) 
                                
    // const userIds = _.uniq(_.map(getState().posts, 'userId'));
    // // no need to 'await' since there is no logic that depends on fetching userId.
    // userIds.forEach(id => dispatch(fetchUser(id)));

    // If we needed to 'await', await doesn't work with for Each, so maybe...
    // await Promise.all(userIds.forEach(id => dispatch(fetchUser(id))));

    // An optional refactoring with _.chain
    _.chain(getState().posts)
        .map('userId')
        .uniq()
        .forEach(id => dispatch(fetchUser(id)))
        .value();  // a better term vor 'value' would be 'execute'
};

export const fetchPosts = () => {
    // this is all Redux-thunk does: wraps an action into a function
    return async dispatch => {
        const res = await jsonPlaceholder.get('/posts');
        // manual dispatch with thunk
        dispatch({ type: 'FETCH_POSTS', payload: res.data });
    }

};

export const fetchUser = (id) => async dispatch => {
    const res = await jsonPlaceholder.get(`/users/${id}`);

    dispatch({
        type: 'FETCH_USER',
        payload: res.data
    });
}