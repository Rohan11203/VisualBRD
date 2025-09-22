import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IScreen extends Document {
  name: string;
  imageUrl: string;
  project: Types.ObjectId;
  annotations: Types.ObjectId[];
}

const screenSchema = new Schema<IScreen>({
  name: {
    type: String,
    required: true,
    default: 'Untitled Screen',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  annotations: [{
    type: Schema.Types.ObjectId,
    ref: 'Annotation',
  }],
}, { timestamps: true });

const ScreenModel = mongoose.model<IScreen>('Screen', screenSchema);
export default ScreenModel;
