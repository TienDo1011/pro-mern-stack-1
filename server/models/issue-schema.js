import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  status: { type: String, required: true },
  owner: { type: String, required: true },
  effort: String,
  created: { type: Date, required: true },
  completionDate: String,
  title: { type: String, required: true },
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
