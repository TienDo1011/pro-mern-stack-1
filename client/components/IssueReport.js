import queryString from 'query-string';
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

import IssueFilter from './IssueFilter';
import withToast from './withToast';

import api from '../api/api';

const statuses = ['New', 'Open', 'Assigned', 'Fixed', 'Verified', 'Closed'];

const StatRow = (props) => (
  <tr>
    <td>{props.owner}</td>
    {statuses.map((status, index) => (<td key={index}>{props.counts[status]}</td>))}
  </tr>
);

StatRow.propTypes = {
  owner: PropTypes.string.isRequired,
  counts: PropTypes.object.isRequired,
};

class IssueReport extends React.Component {
  constructor(props) {
    super(props);
    const { location } = this.props;
    const parsed = queryString.parse(location.search);
    const query = Object.assign({}, parsed);
    this.state = {
      stats: {},
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
    this.props.router.push({ pathname: this.props.location.pathname, query });
  }

  loadData = async () => {
    try {
      const search = this.props.location.search ?
       `${this.props.location.search}&_summary` : '?_summary';
      const data = (await api().get(`/api/issues${search}`)).data;
      this.setState({ stats: data });
    } catch (err) {
      this.props.showError(`Error in fetching data from server: ${err}`);
    }
  }

  render() {
    return (
      <div>
        <IssueFilter setFilter={this.setFilter} initFilter={this.props.location.search} />
        <Table bordered condensed hover responsive>
          <thead>
            <tr>
              <th></th>
              {statuses.map((status, index) => <td key={index}>{status}</td>)}
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.state.stats).map((owner, index) =>
              <StatRow key={index} owner={owner} counts={this.state.stats[owner]} />
            )}
          </tbody>
        </Table>
      </div>
    );
  }
}

IssueReport.propTypes = {
  location: PropTypes.object.isRequired,
  router: PropTypes.object,
  showError: PropTypes.func.isRequired,
};

const IssueReportWithToast = withToast(IssueReport);
IssueReportWithToast.dataFetcher = IssueReport.dataFetcher;

export default IssueReportWithToast;
