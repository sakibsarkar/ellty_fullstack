import Navbar from "components/shared/Navbar";
import { Outlet } from "react-router";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="max-w-[1440px] mx-auto">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
