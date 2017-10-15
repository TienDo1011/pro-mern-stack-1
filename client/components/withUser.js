import React from 'react';

import api from '../api/api';

export default function withUser(OriginalComponent) {
  return class extends React.Component {
    state = {
      user: {},
    }

    async componentDidMount() {
      const userData = (await api().get('/api/users/me')).data;
      if (userData.displayName) {
        this.setState({
          user: {
            name: userData.displayName,
            signedIn: true,
          },
        });
      }
    }

    render() {
      return (
        <OriginalComponent user={this.state.user} {...this.props} />
      );
    }
  };
}
