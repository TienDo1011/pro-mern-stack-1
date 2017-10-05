import queryString from 'query-string';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Table, Pagination } from 'reactstrap';
import IssueFilter from './IssueFilter';
import withToast from './withToast';

import withUser from './withUser';

import api from '../api/api';

const IssueRow = (props) => {
  function onDeleteClick() {
    props.deleteIssue(props.issue._id);
  }

  return (
    <tr>
      <td><Link to={`/issues/${props.issue._id}`}>{props.issue._id.substr(-4)}</Link></td>
      <td>{props.issue.status}</td>
      <td>{props.issue.owner}</td>
      <td>{props.issue.created.toDateString()}</td>
      <td>{props.issue.effort}</td>
      <td>{props.issue.completionDate ? props.issue.completionDate.toDateString() : ''}</td>
      <td>{props.issue.title}</td>
      {props.deleteIssue ? (
        <td>
          <Button bsSize="xsmall" onClick={onDeleteClick}><i className="fa fa-trash" /></Button>
        </td>
      ) : null}
    </tr>
  );
};

IssueRow.propTypes = {
  issue: PropTypes.object.isRequired,
  deleteIssue: PropTypes.func,
};

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue._id} issue={issue} deleteIssue={props.deleteIssue} />
  );
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          {props.deleteIssue ? <th></th> : null}
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </Table>
  );
}

IssueTable.propTypes = {
  issues: PropTypes.array.isRequired,
  deleteIssue: PropTypes.func,
};

const PAGE_SIZE = 10;

class IssueList extends React.Component {
  constructor(props) {
    super(props);
    const data = { metadata: { totalCount: 0 }, records: [] };
    const issues = data.records;
    issues.forEach(issue => {
      issue.created = new Date(issue.created);
      if (issue.completionDate) {
        issue.completionDate = new Date(issue.completionDate);
      }
    });
    const { location } = this.props;
    const parsed = queryString.parse(location.search);
    const query = Object.assign({}, parsed);
    this.state = {
      issues,
      totalCount: data.metadata.totalCount,
      query,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      const { location } = nextProps;
      const parsed = queryString.parse(location.search);
      const query = Object.assign({}, parsed);
      this.setState({
        query,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.loadData();
    }
  }

  setFilter = (query) => {
    this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(query)}`);
  }

  selectPage = (eventKey) => {
    const query = JSON.parse(JSON.stringify(this.state.query));
    query._page = eventKey;
    this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(query)}`);
  }

  loadData = async () => {
    const query = JSON.parse(JSON.stringify(this.state.query));
    const pageStr = query._page;
    if (pageStr) {
      delete query._page;
      query._offset = (parseInt(pageStr, 10) - 1) * PAGE_SIZE;
    }
    query._limit = PAGE_SIZE;
    const search = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');

    try {
      const issuesData = (await api().get(`/api/issues?${search}`)).data;
      const issues = issuesData.records;
      issues.forEach(issue => {
        issue.created = new Date(issue.created);
        if (issue.completionDate) {
          issue.completionDate = new Date(issue.completionDate);
        }
      });
      this.setState({ issues, totalCount: issuesData.metadata.totalCount });
    } catch (err) {
      this.props.showError(`Error in fetching data from server: ${err}`);
    }
  }

  deleteIssue = async (id) => {
    const response = await api().delete(`/api/issues/${id}`);
    if (!response.ok) this.props.showError('Failed to delete issue');
    else this.loadData();
  }

  render() {
    return (
      <div>
        <IssueFilter setFilter={this.setFilter} initFilter={this.props.location.search} />
        {/* <Pagination
          items={Math.ceil(this.state.totalCount / PAGE_SIZE)}
          activePage={parseInt(this.state.query._page || '1', 10)}
          onSelect={this.selectPage} maxButtons={7} next prev boundaryLinks
        /> */}
        <IssueTable
          issues={this.state.issues}
          deleteIssue={this.props.user.signedIn ? this.deleteIssue : null}
        />
      </div>
    );
  }
}

IssueList.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object,
  showError: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const IssueListWithToast = withToast(withUser(IssueList));
IssueListWithToast.dataFetcher = IssueList.dataFetcher;

export default IssueListWithToast;
