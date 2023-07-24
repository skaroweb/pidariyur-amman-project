import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import styles from "./style.module.css";
import Title from "../../components/Title";

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.dashboard_layout}>
      <Sidebar />
      <Title />
      <div className={styles.Main_component}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
