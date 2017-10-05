import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';

import IssueList from './IssueList';
import IssueEdit from './IssueEdit';
import IssueReport from './IssueReport';
import Header from './Header';

import withUser from './withUser';

const NoMatch = () => <p>No match found</p>;

class App extends React.Component {
  onSignin = (name) => {
    this.setState({ user: { signedIn: true, name } });
  }

  onSignout = () => {
    this.setState({ user: { signedIn: false, name: '' } });
  }

  render() {
    // const childrenWithUser = React.Children.map(this.props.children, child =>
    //   React.cloneElement(child, { user: this.state.user })
    // );
    return (
      <div>
        <Header user={this.props.user} onSignin={this.onSignin} onSignout={this.onSignout} />
        <div className="container-fluid">
          {/* {childrenWithUser} */}
          <Switch>
            <Route exact path="/issues" component={withRouter(IssueList)} />
            <Route path="/issues/:id" component={IssueEdit} />
            <Route path="/reports" component={withRouter(IssueReport)} />
            <Route path="*" component={NoMatch} />
          </Switch>
          <hr />
          <h5><small>
            Full source code available at this <a href="https://github.com/vasansr/pro-mern-stack">
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
