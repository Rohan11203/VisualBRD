export interface Annotation {
  _id: string;
  x: number;
  y: number;
  marker: string;
  componentId?: string;
  section?: string;
  interactivity: String;
  isRequired?: boolean;
  isApiAvailable?: boolean;
}

export interface Project {
  _id: string;
  imageUrl: string;
  annotations: Annotation[];
}

export interface NewAnnotation {
  x: number;
  y: number;
}

export interface ImageDimensions {
  naturalWidth: number;
  naturalHeight: number;
}

export interface FormData {
  marker: string;
  componentId: string;
  section: string;
  interactivity: string;
  isRequired: boolean;
  isApiAvailable: boolean;
}