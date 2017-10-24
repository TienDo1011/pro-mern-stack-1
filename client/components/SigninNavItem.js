import React from 'react';
import PropTypes from 'prop-types';
import {
  NavItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  NavDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from 'reactstrap';

import api from '../api/api';

export default class SigninNavItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      disabled: true,
      dropdownOpen: false,
      email: '',
      password: '',
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  signout = async () => {
    try {
      const response = await api().post('/signout');
      if (response.status === 200) {
        this.props.showSuccess('Successfully signed out.');
        this.props.onSignout();
      } else {
        this.props.showError('sign out failed');
      }
    } catch (err) {
      this.props.showError('Network error');
    }
  };

  showModal = () => {
    this.setState({ showing: true });
  };

  hideModal = () => {
    this.setState({ showing: false });
  };

  handleChange = ev => {
    this.setState({
      [ev.target.dataset.type]: ev.target.value,
    });
  };

  login = async (ev) => {
    ev.preventDefault();
    const user = (await api().post('/signin', {
      username: this.state.email,
      password: this.state.password,
    })).data;
    if (user) {
      this.props.onSignin(user.user);
    }
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
      <NavItem onClick={this.showModal}>
        Sign in
        <Modal keyboard isOpen={this.state.showing} autoFocus={false} size="lg">
          <ModalHeader>Sign in</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="6">
                <Form>
                  <fieldset>
                    <legend>Sign in</legend>
                    <FormGroup row>
                      <Label for="email" sm={2}>
                        Email
                      </Label>
                      <Col sm={10}>
                        <Input
                          type="email"
                          name="email"
                          data-type="email"
                          id="email"
                          placeholder="Enter your email"
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="password" sm={2}>
                        Password
                      </Label>
                      <Col sm={10}>
                        <Input
                          type="password"
                          name="password"
                          data-type="password"
                          id="password"
                          placeholder="Enter your password"
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <Button onClick={this.login}>Sign in</Button>
                  </fieldset>
                </Form>
              </Col>
              <Col xs="6">
                <fieldset>
                  <legend>Login using social networks</legend>
                  <Button block disabled={this.state.disabled}>
                    <a href="http://localhost:3001/auth/google">
                      <img
                        src="/btn_google_signin_dark_normal_web.png"
                        alt="Sign in"
                      />
                    </a>
                  </Button>
                </fieldset>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="link" onClick={this.hideModal}>
              Cancel
            </Button>
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
