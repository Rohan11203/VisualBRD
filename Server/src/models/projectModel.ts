import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Untitled Project",
    },
    screens: [
      {
        type: Schema.Types.ObjectId,
        ref: "Screen",
      },
    ],
    imageUrl: {
      type: String,
      require: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;
