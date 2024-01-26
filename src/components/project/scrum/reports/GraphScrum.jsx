import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContextScrum from "../../../../sidebar_app/components_scrum/sidebar_context/SidebarContextScrum";
const GraphScrum = () => {
  const { open } = useContext(SidebarContextScrum);
  const { project } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>Ulaa{project}</p>
      </div>
    </div>
  );
};

export default GraphScrum;
