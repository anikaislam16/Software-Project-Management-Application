import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../../../sidebar_app/components/sidebar_context/SidebarContext";
const Gantt = () => {
  const { open } = useContext(SidebarContext);
  const { projectId } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>ActiveSprint of {projectId}</p>
      </div>
    </div>
  );
};

export default Gantt;
