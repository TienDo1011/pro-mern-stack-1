import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Input, ButtonToolbar, Button,
  Form, FormFeedback, Label, Col, Alert } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NumInput from './NumInput';

import DateInput from './DateInput';
import withToast from './withToast';

import api from '../api/api';
import withUser from './withUser';

class IssueEdit extends React.Component {
  state = {
    issue: {
      _id: '', title: '', status: '', owner: '', effort: null,
      completionDate: null, created: null,
    },
    invalidFields: {}, showingValidation: false,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadData();
    }
  }

  onChange = (event, convertedValue) => {
    const issue = Object.assign({}, this.state.issue);
    const value = (convertedValue !== undefined) ? convertedValue : event.target.value;
    issue[event.target.name] = value;
    this.setState({ issue });
  }

  onValidityChange = (event, valid) => {
    const invalidFields = Object.assign({}, this.state.invalidFields);
    if (!valid) {
      invalidFields[event.target.name] = true;
    } else {
      delete invalidFields[event.target.name];
    }
    this.setState({ invalidFields });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.showValidation();

    if (Object.keys(this.state.invalidFields).length !== 0) {
      return;
    }

    try {
      const response = (await api()
        .put(`/api/issues/${this.props.match.params.id}`,
        this.state.issue));
      if (response.status === 200) {
        const updatedIssue = response.data;
        updatedIssue.created = new Date(updatedIssue.created);
        if (updatedIssue.completionDate) {
          updatedIssue.completionDate = new Date(updatedIssue.completionDate);
        }
        this.setState({ issue: updatedIssue });
        this.props.showSuccess('Updated issue successfully.');
      } else {
        this.props.showError(`Failed to update issue: ${response.data.message}`);
      }
    } catch (err) {
      this.props.showError(`Error in sending data to server: ${err.message}`);
    }
  }

  loadData = async () => {
    try {
      const issue = (await api().get(`/api/issues/${this.props.match.params.id}`)).data;
      issue.created = new Date(issue.created);
      issue.completionDate = issue.completionDate != null ?
        new Date(issue.completionDate) : null;
      this.setState({ issue });
    } catch (err) {
      this.props.showError(`Error in fetching data from server: ${err.message}`);
    }
  }

  showValidation = () => {
    this.setState({ showingValidation: true });
  }

  dismissValidation = () => {
    this.setState({ showingValidation: false });
  }

  render() {
    const issue = this.state.issue;
    let validationMessage = null;
    if (Object.keys(this.state.invalidFields).length !== 0 && this.state.showingValidation) {
      validationMessage = (
        <Alert bsStyle="danger" onDismiss={this.dismissValidation}>
          Please correct invalid fields before submitting.
        </Alert>
      );
    }
    return (
      <Form onSubmit={this.onSubmit}>
        <FormGroup row>
          <Col sm={3}><Label>ID</Label></Col>
          <Col sm={9}>
            <Input readOnly plaintext="plaintext" value={issue._id} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={3}><Label>Created</Label></Col>
          <Col sm={9}>
            <Input
              readOnly plaintext="plaintext"
              value={issue.created ? issue.created.toDateString() : ''}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={3}><Label>Status</Label></Col>
          <Col sm={9}>
            <Input
              type="select" name="status" value={issue.status}
              onChange={this.onChange}
            >
              <option value="New">New</option>
              <option value="Open">Open</option>
              <option value="Assigned">Assigned</option>
              <option value="Fixed">Fixed</option>
              <option value="Verified">Verified</option>
              <option value="Closed">Closed</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={3}><Label>Owner</Label></Col>
          <Col sm={9}>
            <Input name="owner" value={issue.owner} onChange={this.onChange} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={3}><Label>Effort</Label></Col>
          <Col sm={9}>
            <NumInput
              name="effort"
              value={issue.effort} onChange={this.onChange}
              className="form-control"
            />
          </Col>
        </FormGroup>
        <FormGroup row valid={`${!this.state.invalidFields.completionDate}`}>
          <Col sm={3}><Label>Completion Date</Label></Col>
          <Col sm={9}>
            <DateInput
              name="completionDate"
              value={issue.completionDate} onChange={this.onChange}
              onValidityChange={this.onValidityChange}
              className="form-control"
            />
            <FormFeedback />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={3}><Label>Title</Label></Col>
          <Col sm={9}>
            <Input name="title" value={issue.title} onChange={this.onChange} />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={{ offset: 3 }} sm={6}>
            <ButtonToolbar>
              <Button color="primary" type="submit" disabled={!this.props.user.signedIn}>
                Submit
              </Button>
              <LinkContainer to="/issues">
                <Button color="link">Back</Button>
              </LinkContainer>
            </ButtonToolbar>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={{ offset: 3 }} sm={9}>{validationMessage}</Col>
        </FormGroup>
      </Form>
    );
  }
}

IssueEdit.propTypes = {
  match: PropTypes.object.isRequired,
  showSuccess: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const IssueEditWithToast = withToast(withUser(IssueEdit));
IssueEditWithToast.dataFetcher = IssueEdit.dataFetcher;

export default IssueEditWithToast;
