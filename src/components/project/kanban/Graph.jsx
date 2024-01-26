import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SidebarContext from "../../../sidebar_app/components/sidebar_context/SidebarContext";
const Graph = () => {
  const { open } = useContext(SidebarContext);
  const { project } = useParams();
  return (
    <div className={`center-div ${open ? "sidebar-open" : ""}`}>
      <div className="center-content">
        <p>dfdfds {project}</p>
      </div>
    </div>
  );
};

export default Graph;
