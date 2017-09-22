import Issue from '../models/issue-schema';
import { ObjectId } from 'mongodb';
import { validateIssue, cleanupIssue, convertIssue } from '../helper';

// function sendResponse(res, status, content) {
//   res.status(status);
//   res.setHeader('Content-Type', 'application/json');
//   res.end(content);
// }

function getIssues(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.effort_lte || req.query.effort_gte) filter.effort = {};
  if (req.query.effort_lte) filter.effort.$lte = parseInt(req.query.effort_lte, 10);
  if (req.query.effort_gte) filter.effort.$gte = parseInt(req.query.effort_gte, 10);
  if (req.query.search) filter.$text = { $search: req.query.search };

  if (req.query._summary === undefined) {
    const offset = req.query._offset ? parseInt(req.query._offset, 10) : 0;
    let limit = req.query._limit ? parseInt(req.query._limit, 10) : 20;
    if (limit > 50) limit = 50;

    const cursor = Issue.find(filter).sort({ _id: 1 })
    .skip(offset)
    .limit(limit);

    let totalCount;
    cursor.count(false).then(result => {
      totalCount = result;
      return cursor.exec();
    })
    .then(issues => {
      res.json({ metadata: { totalCount }, records: issues });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
  } else {
    Issue.aggregate([
      { $match: filter },
      { $group: { _id: { owner: '$owner', status: '$status' }, count: { $sum: 1 } } },
    ]).toArray()
    .then(results => {
      const stats = {};
      results.forEach(result => {
        if (!stats[result._id.owner]) stats[result._id.owner] = {};
        stats[result._id.owner][result._id.status] = result.count;
      });
      res.json(stats);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    });
  }
}

function addIssue(req, res) {
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) {
    newIssue.status = 'New';
  }

  const err = validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }

  Issue.create(cleanupIssue(newIssue))
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
}

function getIssue(req, res) {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }

  Issue.find({ _id: issueId }).limit(1)
  .then(issue => {
    if (!issue) res.status(404).json({ message: `No such issue: ${issueId}` });
    else res.json(issue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
}

function updateIssue(req, res) {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }

  const issue = req.body;
  delete issue._id;

  const err = validateIssue(issue);
  if (err) {
    res.status(422).json({ message: `Invalid request: ${err}` });
    return;
  }

  Issue.updateOne({ _id: issueId }, convertIssue(issue))
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
}

function deleteIssue(req, res) {
  let issueId;
  try {
    issueId = new ObjectId(req.params.id);
  } catch (error) {
    res.status(422).json({ message: `Invalid issue ID format: ${error}` });
    return;
  }

  Issue.deleteOne({ _id: issueId }).then((deleteResult) => {
    if (deleteResult.result.n === 1) res.json({ status: 'OK' });
    else res.json({ status: 'Warning: object not found' });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
}

export { getIssues, addIssue, getIssue, updateIssue, deleteIssue };
