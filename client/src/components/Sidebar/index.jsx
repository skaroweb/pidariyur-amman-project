import React from "react";

import styles from "./styles.module.css";
import "./index.css";
import Header from "../Header";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Header />
    </div>
  );
};

export default Sidebar;
