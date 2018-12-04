import React from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions/index';

// Separate action creators for UserHeader and Posts

class UserHeader extends React.Component {
    componentDidMount() {
        this.props.fetchUser(this.props.userId);
    }

    render() {
        const { user } = this.props;

        if (!user) {
            return null;
        }
        return <div className="header">{user.name}</div>
    }
}

// Pre-finding the user to send its name to render(). 
// 'ownProps' come from PostList during mapping of each post.
// This is better than passing the full set of users. But, still, if 
// a user with a particular id has already been found, it will be looked for
// here, again, on the next iteration of users.map in PostList. =>
// memoize solution in actions/index.js

const mapStateToProps = (state, ownProps) => {
    return { user: state.users.find(user => user.id === ownProps.userId) };
};

export default connect(mapStateToProps, { fetchUser })(UserHeader);