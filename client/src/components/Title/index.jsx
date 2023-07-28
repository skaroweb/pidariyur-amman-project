import React from "react";
import { useTitleContext } from "../../context/TitleContext";
import styles from "./styles.module.css";

const Title = () => {
  const { title } = useTitleContext();

  return <h1 className={styles.heading}>{title}</h1>;
};

export default Title;
