import mongoose from "mongoose";

const annotationSchema = new mongoose.Schema(
  {
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true },

    // --- VBRD Specific Fields  ---

    // 'Marker' column: The main title for the annotation.
    marker: { type: String, required: true },

    componentId: { type: String },
    section: { type: String }, // e.g., 'Header', 'Product Card'
    source: { type: String },

    // 'Interactivity/Comment/Logic' column: This can still be a long field
    // that supports Markdown for rich text.
    interactivity: { type: String },

    isRequired: { type: Boolean, default: false },
    masterData: { type: String },
    apiName: { type: String },
    isApiAvailable: { type: Boolean, default: false },
    apiId: { type: String },
    thirdPartyIntegration: { type: String },
    authoringFieldName: { type: String },
    fieldContext: { type: String },
    validation: { type: String },
    desktopViewDifference: { type: String },
  },
  { timestamps: true }
);

const AnnotationModel = mongoose.model("Annotation", annotationSchema);
export default AnnotationModel;
