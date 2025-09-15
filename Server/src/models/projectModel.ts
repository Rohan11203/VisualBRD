import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      require: true,
    },

    // List of all annotations that belong to this project.
    // This array will just hold the unique IDs of the annotations.

    annotations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Annotation",
      }],
  },{
    timestamps: true,
  }
);

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;