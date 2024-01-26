import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProjectKanban from "../src/components/project/kanban/ProjectKanban";
import "./App.css";
import Home from "./components/home/Home";
import Navbar1 from "./components/navbar/Navbar1";
import Gantt from "./components/project/kanban/Gantt";
import Graph from "./components/project/kanban/Graph";
import Members from "./components/project/kanban/Member/Members";
import BoardMain from "./components/project/kanban/board/BoardMain";
import ProjectScrum from "./components/project/scrum/ProjectScrum";
import GanttScrum from "./components/project/scrum/gantt/GanttScrum";
import ScrumBoardMain from "./components/project/scrum/board/ScrumBoardMain";
import MemberScrum from "./components/project/scrum/member/Members";
import GraphScrum from "./components/project/scrum/reports/GraphScrum";
import SprintBoardMain from "./components/project/scrum/sprint/SprintBoardMain";
import Forgetpass from "./components/Login/Forgetpass.jsx";
import OTPpass from "./components/Login/OTPpass.jsx";
import Temp from "./components/Login/Temp.jsx";
import Signup from "./components/signup/signup.jsx";
import OTP from "./components/signup/OTP.jsx";
import Login from "./components/Login/Login.jsx";
import Password from "./components/signup/Password.jsx";
import UpdatePass from "./components/Login/UpdatePass.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar1 />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/otp" element={<OTP />} />
          <Route path="/signup/password" element={<Password />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<Forgetpass />}>
            <Route path="otp" element={<OTPpass />} />
          </Route>
          <Route path="/Updatepass" element={<UpdatePass />} />
          <Route path="/login/temp" element={<Temp />} />

          <Route path="/project/kanban/:projectId/" element={<ProjectKanban />}>
            <Route path="gantt" element={<Gantt />} />
            <Route path="members" element={<Members />} />
            <Route index element={<BoardMain />} />
            <Route path="graph" element={<Graph />} />
          </Route>
          <Route path="/project/scrum/:projectId/" element={<ProjectScrum />}>
            <Route path="gantt" element={<GanttScrum />}></Route>
            <Route path="members" element={<MemberScrum />} />
            <Route index element={<SprintBoardMain />} />
            <Route path="board" element={<ScrumBoardMain />} />
            <Route path="graph" element={<GraphScrum />} />
            {/* <Route path="graph" element={<Graph />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
