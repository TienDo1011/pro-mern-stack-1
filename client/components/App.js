import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';
import IssueReport from './IssueReport';
import Header from './Header';

import withUser from './withUser';

import api from '../api/api';

const NoMatch = () => <p>No match found</p>;

class App extends React.Component {
  state = {
    user: {},
  }

  async componentWillMount() {
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

  onSignin = (name) => {
    this.setState({ user: { signedIn: true, name } });
  }

  onSignout = () => {
    this.setState({ user: { signedIn: false, name: '' } });
  }

  render() {
    return (
      <div>
        <Header user={this.state.user} onSignin={this.onSignin} onSignout={this.onSignout} />
        <div className="container-fluid">
          <Switch>
            <Route exact path="/issues" component={withRouter(IssueList)} />
            <Route path="/issues/:id" component={IssueEdit} />
            <Route path="/reports" component={withRouter(IssueReport)} />
            <Route path="*" component={NoMatch} />
          </Switch>
          <hr />
          <h5><small>
            Full source code available at this <a href="https://github.com/TienDo1011/pro-mern-stack-1">
            GitHub repository</a>.
          </small></h5>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: PropTypes.object.isRequired,
};

export default withUser(App);
