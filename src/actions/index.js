import jsonPlaceholder from '../apis/jsonPlaceholder';
import _ from 'lodash';

// export const fetchPosts = () => async dispatch => 

export const fetchPosts = () => {
    // this is all Redux-thunk does: wraps an action into a function
    return async dispatch => {
        const res = await jsonPlaceholder.get('/posts');
        // manual dispatch with thunk
        dispatch({ type: 'FETCH_POSTS', payload: res.data }) ;
    }
    
};

//////////////////////////////////////////////////////////////////
// More traditional approach: fetch all posts, loop over them, 
// find all unique userIds. Then for each userId, do a separate fetch.
//////////////////////////////////////////////////////////////////

// export const fetchUser = (id) => async dispatch => {
//     const res = await jsonPlaceholder.get(`/users/${id}`);

//     dispatch({
//         type: 'FETCH_USER',
//         payload: res.data
//     });
// }


//////////////////////////////////////////////////////////////////
// MEMOIZE
// getting rid of unneeded requests  (Amazing!!!)
//
// function getUser(id) {
//      fetch(id);
//      return 'Made a request!'
// }  // fetch some random number, doesn't matter
// 
//  const memoizedGetUser = _.memoize.(getUser)   
// 
// When we memoize a function, the original function with the same args runs only one time.
// memoizeGetUser(3) // fetches something, returns: 'Made a request!'
// memoizeGetUser(3) // doesn't execute getUser, returns whatever was returned the previous time ('Made a request!')
// memoizeGetUser(3) // -- " --
// memoizeGetUser(2) // fetches new stuff, returns: 'Made a request!'
// memoizeGetUser(2) // doesn't execute getUser, returns whatever was returned the previous time ('Made a request!')
// memoizeGetUser(3) // -- " --
//
// HOW-TO: First step: revert arrow functions back to regular functions:
// 
//  export const fetchUser = function(id) {
//      return async function(dispatch) {
//          const res = await jsonPlaceholder.get(`/users/${id}`);
//          dispatch({type: 'FETCH_USER', payload: res.data });
//      }
// }
//
// 2nd step: attempt to memoize one of the two functions.
// 
// Memoizing the outer function will result in "returning the same every time", 
// which is returning 'function(dispatch)', which will be executing again and again 
// => not a solution.
//
// Memoizing the internal function:
//
//  export const fetchUser = function(id) {
//      return _.memoize(async function(dispatch) {
//          const res = await jsonPlaceholder.get(`/users/${id}`);
//          dispatch({type: 'FETCH_USER', payload: res.data });
//      });
// }
// Every time fetchUser is called, it will declare a new instance of function(dispatch),
// and memoizing every new instance. 
//
// We need to define the function outside of the action creator, that is going to make
// a request and dispatch our action. And we are going to memoize it OUTSIDE
// of the action creator, so that it gets memoized only exactly one time, 
// and it is not going to be re-memoized each time we call our action creator fetchUser. 
//
// See npm memoizee for possible cache mgmnt.
//////////////////////////////////////////////////////////////////

export const fetchUser = id => dispatch => {
    _fetchUser(id, dispatch);
};

const _fetchUser = _.memoize(async (id, dispatch) => {
    const res = await jsonPlaceholder.get(`/users/${id}`);
    dispatch({type: 'FETCH_USER', payload: res.data });
});

// ^^ The same as: 
// getUser(id) {
//      fetch(id);
//      return "Made a request!"
// }
// getUser(3)
// getUser(3)
// getUser(3)
// getUser(3)
// - will be executed every time.
// 
// but 
// memoizedGetUser = _.memoize(getUser)
// memoizedGetUser(3) // executes once
// memoizedGetUser(3) // cache
// memoizedGetUser(3) // cache

