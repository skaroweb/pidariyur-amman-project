import DonationYearChart from "../../components/Dashboard/DonationYearChart";
import DonationMonthChart from "../../components/Dashboard/DonationMonthChart";
import OverallDetail from "../../components/Dashboard/OverallDetail";
import CurrentUserId from "../../components/util/CurrentUserId";

const Dashboard = () => {
  return (
    <div>
      <DonationYearChart />
      <DonationMonthChart />
      <OverallDetail />
      <CurrentUserId />
    </div>
  );
};
export default Dashboard;
