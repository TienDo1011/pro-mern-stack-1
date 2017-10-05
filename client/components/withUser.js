import React from 'react';

import api from '../api/api';

export default function withUser(OriginalComponent) {
  return class extends React.Component {
    state = {
      user: {},
    }

    async componentDidMount() {
      const user = (await api().get('/api/users/me')).data;
      this.setState({
        user,
      });
    }

    render() {
      return (
        <OriginalComponent user={this.state.user} {...this.props} />
      );
    }
  };
}
