import { Outlet } from "react-router-dom";
import HeaderTwo from "../components/HeaderTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";


const MainLayout = () => {
  return (
    <>
      <HeaderTwo category={true} />

      <Outlet />

      <FooterTwo />
      <BottomFooter />
    </>
  );
};

export default MainLayout;