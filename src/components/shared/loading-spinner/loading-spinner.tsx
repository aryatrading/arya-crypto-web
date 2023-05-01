import clsx from "clsx";
import { FC } from "react";
import styles from "./loading-spinner.module.scss";


const LoadingSpinner: FC = () => {

  return (
    <div className={clsx("flex flex-col items-center justify-center", styles["loading-button-overlay"])}>
      <div className={clsx("flex flex-col items-center justify-center", styles["loading-main-button"])}/>
    </div>
  )
}

export default LoadingSpinner;
