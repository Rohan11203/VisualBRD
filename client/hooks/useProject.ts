import { Project } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useProject = () => {
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:3000/api/v1/projects/${id}`)
        .then((response) => {
          setProject(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch project:", err);
          setError(
            "Could not load project. Please check the ID and try again."
          );
        });
    }
  }, [id]);

  return { id, project, setProject, error};
};
