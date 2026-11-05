import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import User, { RoleType } from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import authService from "../../services/auth.service";
import {
  selectUserContact,
  selectUserContactFixed,
  selectUserData,
  selectWelcomeMessage,
} from "../../redux/actions/login/loginSlice";
import Footer from "./elements/footer";
import Header from "./elements/header";
import SideBar from "./elements/sidebar";
import { useDispatch } from "react-redux";
import userService from "../../services/user.service";
import {
  hideBalExp,
  setBalance,
} from "../../redux/actions/balance/balanceSlice";
import { AxiosResponse } from "axios";
import { useNavigateCustom } from "./elements/custom-link";
import { ToastContainer } from "react-toastify";
import { CONSTANTS } from "../../utils/constants";
import {
  selectInitApp,
  selectLoader,
} from "../../redux/actions/common/commonSlice";
import { isMobile } from "react-device-detect";
import Welcome from "../Rules/welcome";
import { useWebsocketUser } from "../../context/webSocketUser";
import { getContact, getContactFixed } from "../../redux/actions/login/login.action";

const Main = () => {
  const dispatch = useDispatch();
  const dispatchNew = useAppDispatch();
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const loader = useAppSelector(selectLoader);
  const navigate = useNavigateCustom();
  const welcomeState = useAppSelector<{ status: boolean }>(
    selectWelcomeMessage,
  );
  const { socketUser } = useWebsocketUser();
  const initApp = useAppSelector(selectInitApp);
  const location = useLocation();

  const userContact = useAppSelector(selectUserContact)
  const userContactFixed = useAppSelector(selectUserContactFixed)

  const whatsapp: any = userContact?.whatsapp ? userContact?.whatsapp : userContactFixed?.whatsapp ? userContactFixed?.whatsapp : '';
  const telegram: any = userContact?.telegram ? userContact?.telegram : userContactFixed?.telegram ? userContactFixed?.telegram : '';
  // React.useEffect(() => {
  //   const currentUserRole = localStorage.getItem('userType')
  //   const rolesWithOutUser = JSON.parse(JSON.stringify(RoleType))
  //   delete rolesWithOutUser.user

  //   if (currentUserRole && Object.keys(rolesWithOutUser).includes(currentUserRole)) {
  //     return navigate.go('/admin')
  //   }
  // }, [])

  const hideHeaderRoutes = ["/terms-conditions", "/responsible-gaming"];

  const hideHeader = hideHeaderRoutes.includes(location.pathname);

  React.useEffect(() => {
    const auth = authService.isLoggedIn();
    // if (!auth) {
    //   return navigate.go('/login')
    // }
    const rolesWithOutUser = JSON.parse(JSON.stringify(RoleType));
    delete rolesWithOutUser.user;

    if (userState.user._id) {
      const sessionId = localStorage.getItem("login-session");
      socketUser.emit("login", {
        role: userState.user.role,
        sessionId: sessionId,
        _id: userState.user._id,
      });
    }

    if (
      userState.user.role &&
      Object.keys(rolesWithOutUser).includes(userState.user.role)
    ) {
      return navigate.go("/");
    }
  }, [userState.user]);

  function handlewhatsappclick() {
    const url = `https://wa.me/${whatsapp}`;
    window.open(url, "_blank"); //
  }
  function handletelegramclick() {
    const url = `https://t.me/${telegram}`;
    window.open(url, "_blank"); //
  }

  React.useEffect(() => {
    userService.getUserBalance().then((res: AxiosResponse) => {
      dispatch(setBalance(res.data.data));
    });
  }, [initApp]);

  React.useEffect(() => {
    try {
      const hideBalExpValues: any = localStorage.getItem(
        CONSTANTS.HIDE_BAL_EXP,
      );
      if (hideBalExpValues) {
        dispatch(hideBalExp(JSON.parse(hideBalExpValues)));
      }
    } catch (e) {
      const err = e as Error;
      console.log(err.stack);
    }
  }, []);
  React.useEffect(() => {
    if (!userState.user?._id) return;

    dispatchNew(getContact());
    dispatchNew(getContactFixed());
  }, [dispatchNew, userState.user?._id]);

  return (
    <div className="frontend">
      {/* {loader && isMobile && (
        <div className='mobile-loader'>
          <i className='mx-5 fas fa-spinner fa-spin'></i>
        </div>
      )} */}

      {!hideHeader && <Header />}
      <ToastContainer hideProgressBar={true} autoClose={1000} />
      {!location.pathname.includes('odds') && !location.pathname.includes('casino') &&
        <>
          <div style={{
            position: 'fixed',
            right: '0px',
            top: '85%',
            zIndex: '1000'
          }} onClick={handlewhatsappclick}>
            <img src="/whatsapp.png" alt="" style={{ width: "60px" }} />
          </div>
          <div style={{
            position: 'fixed',
            left: '10px',
            top: '85%',
            zIndex: '1000'
          }} onClick={handletelegramclick}>
            <img src="/Telegram.png" alt="" style={{ width: "60px" }} />
          </div>
        </>
      }
      <div className="main">
        {!isMobile && (
          <div className="container-fluid ">
            <div className="row">
              {!hideHeader && (
                <div
                  className="col-2 col-lg-2"
                  style={{
                    paddingTop: "4px",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                  }}
                >
                  <SideBar />
                </div>
              )}

              <div
                className={`${!isMobile
                    ? `col-10 ${hideHeader ? 'col-lg-12' : 'col-lg-10'} pr-0 ${location.pathname.includes("casino-in")
                      ? "pl-0"
                      : "pl-1"
                    }`
                    : "col-12 col-lg-12"
                  }`}
                style={{
                  paddingLeft:
                    !isMobile && location.pathname.includes("casino-in")
                      ? "0px"
                      : "",
                  paddingRight:
                    !isMobile && location.pathname.includes("casino-in")
                      ? "0px"
                      : "",
                }}
              >
                <Outlet></Outlet>
              </div>
            </div>
          </div>
        )}
        {isMobile && <Outlet></Outlet>}
      </div>
      <Footer />
      {welcomeState.status ? <Welcome /> : ""}
    </div>
  );
};
export default Main;
