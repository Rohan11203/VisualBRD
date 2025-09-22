"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Folder, Plus, X } from "lucide-react";
import { projectNew } from "next/dist/build/swc/generated-native";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "net";

// Define the type for a project in the list
interface Project {
  _id: string;
  name: string;
  createdAt:string;
  updatedAt: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProjects = () => {
    axios
      .get("http://localhost:3000/api/v1/projects", { withCredentials: true })
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateClick = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProjectName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await axios.post(
        "http://localhost:3000/api/v1/projects/create",
        { name: newProjectName },
        { withCredentials: true }
      );

      setIsCreateDialogOpen(false);
      setNewProjectName("");
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-gray-300 min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading projects...</p>
      </div>
    );
  }

  return (
    <main className="bg-black text-gray-300 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Your Design Projects
            </h1>
            <p className="text-gray-400 mt-1">
              Create and manage your design projects
            </p>
          </div>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center cursor-pointer gap-2 bg-white text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {projects.map((project) => (
              <a
                href={`/project/${project._id}`}
                key={project._id}
                className="text-current no-underline"
              >
                <div className="bg-[#101010] rounded-2xl p-4 flex flex-col gap-4 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer group h-full">
                  <div className="flex-grow flex items-center justify-center bg-[#1C1C1C] aspect-[16/10] rounded-lg">
                    <Folder className="text-gray-600 w-12 h-12 group-hover:text-gray-500 transition-colors" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white truncate">
                      {project.name}
                    </h2>
                    <div className="text-xs text-gray-500 mt-2 space-y-1">
                      <p>Created: {project.createdAt}</p>
                      <p>Modified: {project.updatedAt} </p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mt-10 border-2 border-dashed border-gray-800 rounded-xl">
            <Folder className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first design project to get started
            </p>
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Plus size={18} />
              Create Your First Project
            </button>
          </div>
        )}
      </div>

      {/* Create Project Dialog Modal */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C1C] border border-gray-700 rounded-xl p-6 w-full max-w-lg relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Create New Project
              </h2>
              <button
                onClick={() => setIsCreateDialogOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClick}>
              <div className="space-y-2">
                <label
                  htmlFor="projectName"
                  className="text-sm font-medium text-gray-300"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="w-full bg-black border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
                  autoFocus
                />
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-300 bg-transparent rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim() || isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-black bg-white rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
