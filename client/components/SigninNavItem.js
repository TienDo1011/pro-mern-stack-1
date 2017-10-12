import React from 'react';
import PropTypes from 'prop-types';
import { NavItem, Modal, ModalHeader, ModalBody,
  ModalFooter, Button, NavDropdown, MenuItem } from 'reactstrap';

export default class SigninNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false, disabled: true,
    };
  }

  signout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    fetch('/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(response => {
      if (response.ok) {
        auth2.signOut().then(() => {
          this.props.showSuccess('Successfully signed out.');
          this.props.onSignout();
        });
      }
    });
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
        <NavDropdown title={this.props.user.name} id="user-dropdown">
          <MenuItem onClick={this.signout}>Sign out</MenuItem>
        </NavDropdown>
      );
    }
    return (
      <NavItem onClick={this.showModal}>Sign in
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
      </NavItem>
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
