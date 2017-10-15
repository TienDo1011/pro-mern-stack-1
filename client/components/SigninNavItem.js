import React from 'react';
import PropTypes from 'prop-types';
import { NavItem, Modal, ModalHeader, ModalBody,
  ModalFooter, Button, NavDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import api from '../api/api';

export default class SigninNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false, disabled: true, dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  signout = async () => {
    try {
      const response = (await api().post('/signout'));
      if (response.status === 200) {
        this.props.showSuccess('Successfully signed out.');
        this.props.onSignout();
      } else {
        this.props.showError('sign out failed');
      }
    } catch (err) {
      this.props.showError('Network error');
    }
  }

  showModal = () => {
    this.setState({ showing: true });
  }

  hideModal = () => {
    this.setState({ showing: false });
  }

  render() {
    if (this.props.user.signedIn) {
      return (
        <NavDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle nav caret>
            {this.props.user.name}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.signout}>Sign out</DropdownItem>
          </DropdownMenu>
        </NavDropdown>
      );
    }
    return (
      <div>
        <NavItem onClick={this.showModal}>Sign in
        </NavItem>
        <Modal keyboard isOpen={this.state.showing} autoFocus={false}>
          <ModalHeader>
            Sign in
          </ModalHeader>
          <ModalBody>
            <Button block disabled={this.state.disabled}>
              <a href="http://localhost:3001/auth/google"><img src="/btn_google_signin_dark_normal_web.png" alt="Sign in" /></a>
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={this.hideModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

SigninNavItem.propTypes = {
  user: PropTypes.object,
  onSignin: PropTypes.func.isRequired,
  onSignout: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  showSuccess: PropTypes.func.isRequired,
};
