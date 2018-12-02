import jsonPlaceholder from '../apis/jsonPlaceholder';

// export const fetchPosts = () => async dispatch => 

export const fetchPosts = () => {
    // this is all Redux-thunk does: wraps an action into a function
    return async dispatch => {
        const res = await jsonPlaceholder.get('/posts');

        // manual dispatch with thunk
        dispatch({
            type: 'FETCH_POSTS',
            payload: res
        }) ;
        console.log(res);
    }
    
};