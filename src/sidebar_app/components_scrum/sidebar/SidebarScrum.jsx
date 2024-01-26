import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Dashboard from "../../Images/dashboard.svg";
import News from "../../Images/news.svg";
import Performance from "../../Images/performance.svg";
import Transactions from "../../Images/transactions.svg";
import table from "../../Images/table.svg";
import Settings from "../../Images/settings.svg";
import ulaa from "../../Images/ulaa.png";
import backlog from "../../Images/backlog.png";
// import Settings from "../Images/settings.svg";
// import Support from "../Images/support.svg";
// import { useLocation } from "react-router-dom";
import "../../css/main.scss";
import SidebarContextScrum from "../sidebar_context/SidebarContextScrum";
const SidebarScrum = ({ projectId }) => {
  const { open, setOpen } = useContext(SidebarContextScrum);
  console.log("open  " + open);
  console.log("fddf " + projectId);
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [closeMenu, setCloseMenu] = useState(false);
  console.log(location.pathname);
  console.log(location);
  const handleCloseMenu = () => {
    setCloseMenu(!closeMenu);
    setOpen(!open);
  };
  const fetchProjectName = async () => {
    console.log(projectId);
    try {
      const response = await fetch(
        `http://localhost:3010/projects/scrum/${projectId}`
      );
      const result = await response.json();

      if (result) {
        console.log(result);
        setProjectName(result.projectName);
      } else {
        console.error("Failed to fetch project name");
      }
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };
  useEffect(() => {
    console.log("g " + projectId);

    if (projectId) {
      fetchProjectName();
    }
  }, [projectId]);
  return (
    <div className={closeMenu === false ? "sidebar" : "sidebar active"}>
      <div
        className={
          closeMenu === false ? "logoContainer" : "logoContainer active"
        }
      >
        <h6 className="title">{projectName}</h6>
      </div>
      <div
        className={
          closeMenu === false ? "burgerContainer" : "burgerContainer active"
        }
      >
        <div
          className="burgerTrigger"
          onClick={() => {
            handleCloseMenu();
          }}
        ></div>
        <div className="burgerMenu"></div>
      </div>

      <div
        className={
          closeMenu === false ? "contentsContainer" : "contentsContainer active"
        }
      >
        <ul>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}`}>
              <img src={backlog} alt="" />
              <span className="text-hidden">Backlog</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/board`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/board`}>
              <img src={Dashboard} alt="" />
              <span className="text-hidden">Board</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/gantt`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/gantt`}>
              <img src={ulaa} alt="Transactions" />
              <span className="text-hidden">Gantt Chart</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/graph`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/graph`}>
              <img src={Performance} alt="Performance" />
              <span className="text-hidden">Reports</span>
            </NavLink>
          </li>
          <li
            className={
              location.pathname === `/project/scrum/${projectId}/members`
                ? "active"
                : ""
            }
          >
            <NavLink to={`/project/scrum/${projectId}/members`}>
              <img src={News} alt="News" />
              <span className="text-hidden">Members</span>
            </NavLink>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default SidebarScrum;
