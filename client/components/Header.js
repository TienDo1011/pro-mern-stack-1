import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavbarBrand, Nav, NavItem, Col } from 'reactstrap';
import { withRouter, NavLink } from 'react-router-dom';
import Select from 'react-select';

import IssueAddNavItem from './IssueAddNavItem';
import SigninNavItem from './SigninNavItem';
import SignupNavItem from './SignupNavItem';

import withToast from './withToast.js';

import api from '../api/api';

const Header = (props) => {
  async function searchIssues(input) {
    if (input.length < 2) return Promise.resolve({ options: [] });
    let options;
    try {
      const data = (await api().get(`/api/issues?search=${input}`)).data;
      options = data.records.map(issue => ({
        value: issue._id,
        label: `${issue._id.substr(-4)}: ${issue.title}`,
      }));
    } catch (error) {
      this.props.showError(`Error fetching data from server: ${error}`);
    }
    return { options };
  }

  function filterOptions(options) {
    return options;
  }

  function selectIssue(item) {
    if (item) props.history.push(`/issues/${item.value}`);
  }

  return (
    <Navbar className="fluid">
      <Col sm="5">
        <NavbarBrand>Issue Tracker</NavbarBrand>
        <Nav style={{ display: 'inline-flex' }}>
          <NavItem>
            <NavLink to="/issues">
                Issues
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/reports">
                Reports
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
      <Col sm="4">
        <div style={{ paddingTop: 8 }}>
          <Select.Async
            instanceId="search" placeholder="Search ..." autoload={false} cache={false}
            loadOptions={searchIssues} filterOptions={filterOptions} onChange={selectIssue}
          />
        </div>
      </Col>
      <Col sm="3">
        <Nav className="pull-right">
          {props.user.signedIn ? <IssueAddNavItem showError={props.showError} /> : null}
          <SignupNavItem
            user={props.user} onSignin={props.onSignin} onSignout={props.onSignout}
            showError={props.showError} showSuccess={props.showSuccess}
          />
          <SigninNavItem
            user={props.user} onSignin={props.onSignin} onSignout={props.onSignout}
            showError={props.showError} showSuccess={props.showSuccess}
          />
        </Nav>
      </Col>
    </Navbar>
  );
};

Header.propTypes = {
  showError: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
  onSignin: PropTypes.func.isRequired,
  onSignout: PropTypes.func.isRequired,
  user: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withToast(Header));
