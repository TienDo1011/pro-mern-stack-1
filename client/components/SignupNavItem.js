import React from 'react';
import PropTypes from 'prop-types';
import {
  NavItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
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

  signup = async ev => {
    ev.preventDefault();
    const user = (await api().post('/signup', {
      username: this.state.email,
      password: this.state.password,
    })).data;
    if (user) {
      this.props.onSignin(user.user);
    }
  };

  render() {
    if (this.props.user.signedIn) {
      return (
        ''
      );
    }
    return (
      <NavItem onClick={this.showModal}>
        Sign up
        <Modal keyboard isOpen={this.state.showing} autoFocus={false}>
          <ModalHeader>Sign up</ModalHeader>
          <ModalBody>
            <Form>
              <fieldset>
                <legend>Sign up</legend>
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
                <Button onClick={this.signup}>Sign up</Button>
              </fieldset>
            </Form>
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
