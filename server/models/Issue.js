import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  status: { type: String, required: true },
  owner: { type: String, required: true },
  effort: Number,
  created: { type: Date, required: true },
  completionDate: Date,
  title: { type: String, required: true },
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
