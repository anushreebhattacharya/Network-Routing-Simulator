import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  { _id: false },
);

const edgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    weight: { type: Number, required: true },
    bidirectional: { type: Boolean, default: true },
  },
  { _id: false },
);

const topologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 300, default: '' },
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
    defaultSource: { type: String, default: '' },
    defaultDestination: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Topology = mongoose.model('Topology', topologySchema);
