'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Screen {
  _id: string;
  name: string;
  imageUrl: string;
}

interface Project {
  _id: string;
  name: string;
  screens: Screen[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      // Fetch the specific project and its populated screens
      axios.get(`http://localhost:3000/api/v1/projects/${projectId}`, { withCredentials: true })
        .then(response => {
          setProject(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch project:", error);
          setLoading(false);
        });
    }
  }, [projectId]);

  if (loading) return <p className="text-center mt-10">Loading project details...</p>;
  if (!project) return <p className="text-center mt-10">Project not found.</p>;

  return (
    <main className="bg-black text-gray-300 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 ">Project: {project.name}</h1>
      <h2 className="text-xl font-semibold mb-4 ">Screens</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {project.screens.map(screen => (
          <Link href={`/projects/${projectId}/screens/${screen._id}`} key={screen._id}>
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              <img src={screen.imageUrl} alt={screen.name} className="w-full h-48 object-contain" />
              <div className="p-4">
                <h3 className="font-bold text-black">{screen.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
