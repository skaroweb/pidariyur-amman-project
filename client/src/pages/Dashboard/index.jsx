import DonationYearChart from "../../components/Dashboard/DonationYearChart";
import DonationMonthChart from "../../components/Dashboard/DonationMonthChart";
import OverallDetail from "../../components/Dashboard/OverallDetail";
//import CurrentUserId from "../../components/util/CurrentUserId";
import styles from "./index.module.css";

const Dashboard = () => {
  return (
    <div>
      <div className={styles.chartMain}>
        <DonationYearChart />
        <DonationMonthChart />
      </div>
      <div>
        <OverallDetail />
      </div>

      {/* <CurrentUserId /> */}
    </div>
  );
};
export default Dashboard;
