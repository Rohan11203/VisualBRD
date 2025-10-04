import { apiClient } from "@/lib/apiClient";
import { Project } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useProject = () => {
  const params = useParams();
  const id = params.screenId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        try {
          const data = await apiClient(`/screens/${id}`);
          setProject(data);
        } catch (err) {
          console.error("Failed to fetch project:", err);
          setError(
            "Could not load project. Please check the ID and try again."
          );
        }
      }
    };

    fetchProject();
  }, [id]);

  return { id, project, setProject, error };
};
