// styles
import "./Dashboard.css";

import { useCollection } from "../../hooks/useCollection";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

import ProjectList from "../../comps/ProjectList";
import ProjectFilter from "./ProjectFilter";

export default function Dashboard() {
  const { documents, error } = useCollection("projects");
  const { user } = useAuthContext();

  const [currentFilter, setCurrentFilter] = useState("all");

  const projects = documents
    ? documents.filter((project) => {
        switch (currentFilter) {
          case "all":
            return true;
          case "mine":
            let assignedToMe = false;
            project.assignedUsersList.forEach((filteredUser) => {
              if (filteredUser.id === user.uid) {
                assignedToMe = true;
              }
            });
            return assignedToMe;
          case "development":
          case "design":
          case "sales":
          case "marketing":
            return project.category === currentFilter;
          default:
            return true;
        }
      })
    : null;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter
          currentFilter={currentFilter}
          setCurrentFilter={setCurrentFilter}
        />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  );
}
