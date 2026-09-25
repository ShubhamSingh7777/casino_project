import React, { ChangeEvent, MouseEvent, useRef, useState } from "react";
import User from "../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  logout,
  selectUserData,
} from "../../../redux/actions/login/loginSlice";
import NavMenu from "./nav-menu";
import {
  hideBalExp,
  HideBalExp,
  selectBalance,
  selectHideBalExp,
  setExposer,
  setSingleBal,
} from "../../../redux/actions/balance/balanceSlice";
import { CustomLink, useNavigateCustom } from "./custom-link";
import { isMobile } from "react-device-detect";
import Marqueemessge from "../../../admin-app/pages/_layout/elements/welcome";
import NavMobileMenu from "./nav-mobile-menu";
import axios, { AxiosResponse } from "axios";
import { CONSTANTS } from "../../../utils/constants";
import userService from "../../../services/user.service";
import ReactModal from "react-modal";
import { useWebsocketUser } from "../../../context/webSocketUser";
import Rules from "../../Rules/rules";
import { selectRules } from "../../../redux/actions/common/commonSlice";
import AutocompleteComponent from "../../../components/AutocompleteComponent";
import matchService from "../../../services/match.service";
import IMatch from "../../../models/IMatch";
import casinoSlugs from "../../../utils/casino-slugs.json";
import Carouselslider from "../../../components/Carousel";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SubmitButton from "../../../components/SubmitButton";
import { loginAction } from "../../../redux/actions/login/login.action";
import SideBar from "./sidebar";
import ButtonValues from "../../button-values/button-values";

const Header = () => {
  const sessionId = localStorage.getItem("token");
  const isDemo = localStorage.getItem("isDemo") === "true";
  const ref = useRef<any>(null);
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const balance = useAppSelector(selectBalance);
  const selectHideBal = useAppSelector<HideBalExp>(selectHideBalExp);
  const rules = useAppSelector(selectRules);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userState1 = useAppSelector(selectUserData);
  const tempBalance = localStorage.getItem("balance");
  const tempExposer = localStorage.getItem("exposer");
  const tempUser = localStorage.getItem("username");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log(tempBalance, "tempbalance");

  const navigate = useNavigateCustom();
  const navigate1 = useNavigate();

  const { socketUser } = useWebsocketUser();

  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [showAuto, setShowAuto] = React.useState<boolean>(false);

  const [userMessage, setUserMessage] = React.useState<string>(
    "Welcome to our exchange platform",
  );

  const [hideExpBal, setHideExpBal] = React.useState<HideBalExp>(
    {} as HideBalExp,
  );

  const [isOpen, setIsOpen] = React.useState<any>(false);
  const [isOpenRule, setIsOpenRule] = React.useState<any>(false);
  const [getExposerEvent, setGetExposerEvent] = React.useState<any>([]);
  const [showButtonValueModal, setShowButtonValueModal] = useState(false);

  const openButtonValueModal = () => {
    closeMenu();
    setShowButtonValueModal(true);
  };

  const closeButtonValueModal = () => {
    setShowButtonValueModal(false);
  };

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SITE_URL}/userMessage.json?v=${Date.now()}`)
      .then((res: AxiosResponse) => {
        setUserMessage(res.data.message);
      });
  }, []);

  React.useEffect(() => {
    console.log(balance, "balance");
    if (balance.balance != null && balance.balance != undefined) {
      localStorage.setItem("balance", balance.balance.toFixed(2));
    }
    if (balance.exposer != null && balance.exposer != undefined) {
      localStorage.setItem("exposer", balance.exposer.toFixed(2));
    }
  }, [balance]);

  React.useEffect(() => {
    console.log(userState, "userState");
  });

  React.useEffect(() => {
    setIsOpenRule(rules.open);
  }, [rules]);

  React.useEffect(() => {
    const handlerExposer = ({ exposer, balance }: any) => {
      if (balance !== undefined) dispatch(setSingleBal(balance));
      if (exposer !== undefined) dispatch(setExposer(exposer));
    };
    socketUser.on("updateExposer", handlerExposer);

    return () => {
      socketUser.removeListener("updateExposer", handlerExposer);
    };
  }, [balance]);

  React.useEffect(() => {
    setHideExpBal(selectHideBal);
  }, [selectHideBal]);

  const logoutUser = (e: any) => {
    localStorage.removeItem("login-session");
    localStorage.removeItem("isDemo");
    e.preventDefault();
    dispatch(logout());
    setShowMenu(false);
    // window.location.assign("/match/4/in-play");
    navigate.go("/");
  };

  React.useEffect(() => {
    if (userState1.status === "done") {
      const { role, _id } = userState.user;
      localStorage.setItem("username", userState?.user?.username);
      socketUser.emit("login", {
        role: userState.user.role,
        sessionId: userState.user.sessionId,
        _id,
      });
      localStorage.setItem("login-session", userState.user.sessionId);
      // ✅ DO NOT override demo login
      if (localStorage.getItem("isDemo") === null) {
        localStorage.setItem("isDemo", "false");
      }

      // if (userState.user.role && ['admin', '1', '2', '3'].includes(userState.user.role)) {
      //   return navigate.go('/')
      // }

      // return isMobile ? navigate.go("/match/4") : navigate.go("/match/4");
    }
  }, [userState]);

  const onChangeBalExp = (e: ChangeEvent<HTMLInputElement>) => {
    const expBal = { ...hideExpBal, [e.target.name]: e.target.checked };
    dispatch(hideBalExp(expBal));
    localStorage.setItem(CONSTANTS.HIDE_BAL_EXP, JSON.stringify(expBal));
    setHideExpBal(expBal);
  };

  const getExposer = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(true);
    userService.getExposerEvent().then((res: AxiosResponse) => {
      setGetExposerEvent(res.data.data);
    });
  };

  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (showMenu && ref.current && !ref.current.contains(event.target)) {
        closeMenu();
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, showMenu]);

  const closeMenu = () => {
    setShowMenu(false);
  };
  const suggestion = ({ value }: any) => {
    return matchService.getMatchListSuggestion({ name: value });
  };

  const onMatchClick = (match: IMatch | null) => {
    if (match) {
      window.location.href = `/odds/${match.matchId}`;
    }
  };
  const [loginForm, setLoginForm] = React.useState<User>({
    username: "",
    password: "",
    logs: "",
    isDemo: false,
  });
  const handleSubmit = () => {
    dispatch(loginAction(loginForm));
  };

  const handleSubmitDemoLogin = () => {
    const loginFormNew = { ...loginForm, isDemo: true };
    setLoginForm(loginFormNew);
    localStorage.setItem("isDemo", "true");
    dispatch(loginAction(loginFormNew)); // directly call action with updated form
    return isMobile ? navigate.go("/match/4") : navigate.go("/match/4");
  };
  // const mainBalance = balance?.balance ?? tempBalance ?? 0;
  const mainBalance = Math.floor(
  Number(balance?.balance ?? tempBalance ?? 0)
);
  // console.log(mainBalance,'mainbalance--------------------')
  const exposure = balance?.exposer ?? tempExposer ?? 0;
  // console.log(exposure,'exposure--------------------')

  const availableBalance = mainBalance;
  // console.log(availableBalance,'avialable--------------------')
  const isCasinoPage =
    location.pathname.startsWith("/match/4") ||
    location.pathname.startsWith("/match/4");
  const hideMobileMenu =
    location.pathname.startsWith("/casino/") ||
    location.pathname === "/accountstatement" ||
    location.pathname === "/bethistory" ||
    location.pathname === "/button-values" ||
    location.pathname === "/rules" ||
    location.pathname === "/settings/security-auth";
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row">
          <div className="header-top col-md-12">
            <div className="flex05 logomobiledesign" style={{ flex: "1" }}>
              <div>
                <div className="d-flex justify-content-center align-items-center">
                  {/* {isMobile ? (
                    <CustomLink to="/match/4">
                      <i
                        className={isCasinoPage ? "fas fa-bars" : "fas fa-home"}
                        style={{ fontSize: "20px", marginRight: ".5rem" }}
                      />
                    </CustomLink>
                  ) : (
                    ""
                  )} */}
                  {isMobile ? (
                    isCasinoPage ? (
                      <i
                        className="fas fa-bars"
                        style={{
                          fontSize: "20px",
                          marginRight: ".5rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setIsSidebarOpen(true)}
                      />
                    ) : (
                      <CustomLink to="/match/4">
                        <i
                          className="fas fa-home"
                          style={{ fontSize: "20px", marginRight: ".5rem" }}
                        />
                      </CustomLink>
                    )
                  ) : null}
                  <CustomLink
                    to="/match/4"
                    className="logo router-link-exact-active router-link-active"
                  >
                    <img src="/imgs/logo.png" className="logo-icon" />
                  </CustomLink>
                </div>
                {/* {isMobile ? <Marqueemessge message={userMessage} /> : ""} */}
              </div>
              <div
                style={{
                  width: isMobile ? "65%" : "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                  alignItems: "center",
                  marginRight: sessionId ? "0px" : "0px",
                  padding: !isMobile ? "9px 0px 0px 0px" : "",
                }}
              >
                {" "}
                <div
                  style={{
                    width: isMobile ? "100%" : "",
                    height: "auto",
                    marginRight: isMobile ? "7px" : "",
                  }}
                >
                  {/* // SHOW PROFILE MENU IF LOGGED IN */}
                  <div>
                    <ul
                      className="flex05 justify-content-end d-flex profile-right-side"
                      style={{ flex: "1" }}
                    >
                      {/* <div className='row-deposit-button mr-20'>
                  <CustomLink className='btn btn-deposit mr-10' to={'/deposit'}>Deposit</CustomLink>
                  <CustomLink className='btn btn-withdraw' to={'/withdraw'}>Withdraw</CustomLink>
                  </div> */}
                      {!isMobile ? (
                        <>
                          <li className="search float-left row">
                            {/* <input
                        name='game_keyword'
                        placeholder='All Events'
                        autoComplete='off'
                       type='text'
                        className='search-input-show'
                        /> */}
                            <AutocompleteComponent<IMatch>
                              className={`search-input-show ${
                                showAuto ? "show" : ""
                              }`}
                              label={"Search"}
                              optionKey={"name"}
                              api={suggestion}
                              onClick={onMatchClick}
                            />
                            <a
                              href="#"
                              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                setShowAuto(!showAuto);
                              }}
                              className={`search-input`}
                            >
                              <i className="fas fa-search-plus" />
                            </a>
                          </li>
                          <li className="float-left download-apklink">
                            <div>
                              <a
                                href="#"
                                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                                  e.preventDefault();
                                  setIsOpenRule(true);
                                }}
                                className="rules-link m-r-5"
                              >
                                <b>Rules</b>
                              </a>
                            </div>
                          </li>
                          <li className="float-left">
                            {sessionId && !isDemo && (
                              <div className="d-flex gap-2 py-1">
                                <button
                                  className="btn w-50 mr-1 btn-depositnew"
                                  onClick={() => navigate1("/deposit")}
                                >
                                  Deposit
                                </button>
                                <button
                                  className="btn w-50 btnwithdraw-new"
                                  onClick={() => navigate1("/withdraw")}
                                >
                                  Withdraw
                                </button>
                              </div>
                            )}
                          </li>
                        </>
                      ) : (
                        ""
                      )}
                      <li className="ballance float-left">
                        {!selectHideBal.balance ? (
                          <div
                            className="mby-5 mby-8"
                            style={{ marginBottom: isMobile ? "8px" : "" ,}}
                          >
                            <span className={isMobile ? "balanceTxt" : ""}>
                              Balance:
                            </span>
                            {/* <span>
                           <i
                             className={isMobile ? 'tx-14 fa fa-university' : 'fa fa-university'}
                             aria-hidden='true'
                            ></i>
                         </span>
                        )} */}
                            <b>
                              <span className={isMobile ? "balanceTxt" : ""}>
                                {/* {balance.balance !== null &&
                                    balance.balance !== undefined
                                      ? balance?.balance?.toFixed(2)
                                      : tempBalance
                                      ? tempBalance
                                      : "0.00"} */}
                                {availableBalance}
                              </span>
                            </b>
                          </div>
                        ) : (
                          ""
                        )}
                        {!isMobile ? (
                          !selectHideBal.exposer ? (
                            <div className="mty-5">
                              <a href="#" onClick={getExposer}>
                                <span>Exp:</span>
                                <b>
                                  <span>
                                    {balance?.exposer !== null &&
                                    balance?.exposer !== undefined
                                      ? balance.exposer.toFixed(0)
                                      : tempExposer || "0"}
                                  </span>
                                </b>
                              </a>
                            </div>
                          ) : null
                        ) : null}
                      </li>
                      <li className="account float-left mobile-exposure">
                        {/* {!isMobile && !selectHideBal.balance ? (
                     <div>
                       <span>
                          <i className='tx-13 mrc-2 fa fa-university' aria-hidden='true'></i>
                       </span>
                       <span className='tx-13'>{balance.balance?.toFixed(2)}</span>
                     </div>
                    ) : (
                      ''
                    )} */}
                        {isMobile ? (
                          !selectHideBal.exposer ? (
                            <div
                              className="mty-5"
                              style={{
                                paddingRight: sessionId ? "3px" : "0px",
                                width: isMobile ? "" : "",
                                
                              }}
                            >
                              <a href="#" onClick={getExposer}>
                                <span className={isMobile ? "balanceTxt" : ""}>
                                  Exp:{" "}
                                </span>
                                <b>
                                  <span
                                    className={isMobile ? "balanceTxt" : ""}
                                  >
                                    {balance?.exposer !== null &&
                                    balance?.exposer !== undefined
                                      ? balance.exposer.toFixed(0)
                                      : tempExposer || "0"}
                                  </span>
                                </b>
                              </a>
                            </div>
                          ) : null
                        ) : null}
                        <span
                          className={isMobile ? "profile-section tx-14" : ""}
                          onClick={() => setShowMenu(!showMenu)}
                          style={{
                            background: "none",
                            padding: isMobile ? "0px 0px" : "7px 0px",
                            marginLeft: isMobile ? "5px" : "0px",
                          }}
                        >
                          <span className="elipssisText">
                            {" "}
                            {userState?.user?.username || tempUser}
                          </span>
                          <i className="fas fa-chevron-down" />
                        </span>
                        {/*add class d-block -*/}
                        <ul
                          ref={ref}
                          style={{ display: showMenu ? "block" : "none" }}
                          className=""
                        >
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/match/in-play"
                              className=""
                            >
                              Home
                            </CustomLink>
                          </li> */}
                          {/* <li>
                       <CustomLink onClick={() => closeMenu()} to='/deposit' className=''>
                         Deposit
                       </CustomLink>
                     </li>
                     <li>
                       <CustomLink onClick={() => closeMenu()} to='/withdraw' className=''>
                         Withdraw
                       </CustomLink>
                     </li> */}
                          <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/accountstatement"
                              className=""
                            >
                              Account Statement
                            </CustomLink>
                          </li>
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/depositstatement"
                              className=""
                            >
                              Deposit Statement
                            </CustomLink>
                          </li>
                          <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/withdrawstatement"
                              className=""
                            >
                              Withdraw Statement
                            </CustomLink>
                          </li> */}
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/profitloss"
                              className=""
                            >
                              Profit Loss Report
                            </CustomLink>
                          </li> */}
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/bethistory"
                              className=""
                            >
                              Current Bet
                            </CustomLink>
                          </li> */}
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to=""
                              className=""
                            >
                              Activity Logs
                            </CustomLink>
                          </li> */}
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/unsettledbet"
                              className=""
                            >
                              Unsettled Bet
                            </CustomLink>
                          </li> */}
                          <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/casino/result"
                              className=""
                            >
                              Casino Results
                            </CustomLink>
                          </li>
                          {/* <li>
                            <CustomLink
                              onClick={() => closeMenu()}
                              to="/casino/result"
                              className=""
                            >
                              Live Casino Bets
                            </CustomLink>
                          </li> */}
                          <li>
                            <CustomLink
                              onClick={openButtonValueModal}
                              to=""
                              className=""
                            >
                              Set Button Values
                            </CustomLink>
                          </li>

                          {!isDemo ? (
                            <>
                              <li>
                                <CustomLink
                                  onClick={() => closeMenu()}
                                  to="/settings/security-auth"
                                  className=""
                                >
                                  Security Auth Verification
                                </CustomLink>
                              </li>
                              <li>
                                <CustomLink
                                  onClick={() => closeMenu()}
                                  to="/changepassword"
                                  className=""
                                >
                                  Change Password
                                </CustomLink>
                              </li>
                            </>
                          ) : (
                            ""
                          )}
                          {isMobile ? (
                            <>
                              <li>
                                <CustomLink
                                  onClick={() => closeMenu()}
                                  to="/rules"
                                  className=""
                                >
                                  Rules
                                </CustomLink>
                              </li>
                              <li>
                                <label className="mb-0">
                                  {" "}
                                  Balance
                                  <input
                                    type={"checkbox"}
                                    name={"balance"}
                                    checked={hideExpBal.balance || false}
                                    onChange={onChangeBalExp}
                                    className="mrc-5"
                                    style={{
                                      marginLeft: isMobile ? "84px" : "83px",
                                    }}
                                  />
                                </label>
                              </li>
                              <li>
                                <label className="mb-0">
                                  {" "}
                                  Exposer
                                  <input
                                    type={"checkbox"}
                                    name={"exposer"}
                                    checked={hideExpBal.exposer || false}
                                    onChange={onChangeBalExp}
                                    className="mrc-5"
                                    style={{
                                      marginLeft: isMobile ? "84px" : "83px",
                                    }}
                                  />
                                </label>
                              </li>
                            </>
                          ) : (
                            ""
                          )}

                          <li className="border-top">
                            <a
                              onClick={logoutUser}
                              href={"#"}
                              style={{
                                fontWeight: "400",
                                color: "#000000",
                                textTransform: "capitalize",
                              }}
                            >
                              signOut
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  {/* {!isMobile ? <Marqueemessge message={userMessage} /> : ""} */}
                </div>
                {/* {sessionId ? (
                  <>
                
                  </>
                ) : ( */}
                {/* // SHOW LOGIN/REGISTER IF NOT LOGGED IN */}
                <>
                  {/* <div
                      className="justify-content-center flex-column d-flex"
                      style={{
                        width: isMobile ? "84%" : "50%",
                        alignItems: isMobile ? "center" : "end",
                      }}
                    >
                      <div className="justify-content-center align-center d-flex">
                        <SubmitButton
                          type="submit"
                          formNoValidate
                          onClick={() => handleSubmitDemoLogin()}
                          className="btn btn-submit btn-login mb-0"
                          style={{
                            border: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: isMobile ? "12px" : "16px",
                            padding: isMobile ? "8px 16px" : "5px 16px",
                            height: "auto",
                            marginRight: isMobile ? "0px" : "5px",
                            borderRadius: "0px",
                            background: isMobile ? "#ffffff" : "#2C3E50",
                            fontWeight: "bold",
                            color: isMobile ? "#0088CC" : "",
                          }}
                        >
                          Demo */}
                  {/* {userState1.status === 'loading' ? (
                          <i className='ml-2 fas fa-spinner fa-spin'></i>
                        ) : (
                         <i className='fas fa-sign-in-alt'></i>
                        )} */}
                  {/* </SubmitButton> */}
                  {/* <CustomLink
                          to="/login"
                          className=""
                          style={{
                            border: "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: isMobile ? "12px" : "16px",
                            padding: isMobile ? "8px 16px" : "5px 16px",
                            height: "auto",
                            marginRight: isMobile ? "5px" : "7px",
                            borderRadius: "0px",
                            background: "#2C3E50",
                            fontWeight: "bold",
                            textDecoration: "none",
                          }}
                        >
                          Login
                        </CustomLink> */}
                  {/* <CustomLink
                          to="/register"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: isMobile ? "12px" : "16px",
                            padding: isMobile ? "8px 16px" : "5px 16px",
                            height: "auto",
                            background: "#2C3E50",
                            fontWeight: "bold",
                            textDecoration: "none",
                          }}
                        >
                          Register
                        </CustomLink> */}
                  {/* </div> */}
                  {/* {!isMobile ? <Marqueemessge message={userMessage} /> : ""} */}
                  {/* </div> */}
                </>
                {/* )} */}
              </div>
            </div>
            {isMobile ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: isDemo ? "100%" : sessionId ? "100%" : "100%",
                  }}
                >
                  <Marqueemessge message={userMessage} />
                </div>
                <div style={{ width: !isDemo ? "0%" : "0" }}>
                  {sessionId && !isDemo && (
                    <div className="d-flex gap-2 py-1">
                      <button
                        className="btn w-50 btn-depositnew"
                        onClick={() => navigate1("/deposit")}
                      >
                        Deposit
                      </button>
                      <button
                        className="btn w-50 btnwithdraw-new"
                        onClick={() => navigate1("/withdraw")}
                      >
                        Withdraw
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {/* {!isMobile ? <NavMenu /> : <NavMobileMenu />} */}
          {!isMobile ? <NavMenu /> : !hideMobileMenu && <NavMobileMenu />}
          {/* {isMobile && !location.pathname.includes('/odds') && !location.pathname.includes('/casino') ?<Carouselslider />:''} */}
        </div>
      </div>
      <div />
      <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="form-group">
            <input
              type="search"
              placeholder="Search here"
              className="form-control"
            />
          </div>

          <button
            className="circle-btn-mob"
            onClick={() => setIsSidebarOpen(false)}
          >
            <i className="far fa-times-circle"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <SideBar />

          {/* Add more menu items here */}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {showButtonValueModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-dialog set-button-modal-dialog"
            style={{ margin: isMobile ? "0px" : "4px 30%" }}
          >
            <div className="modal-content" style={{ marginTop: "0px" }}>
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ fontSize: isMobile ? "16px" : "" }}
                >
                  Set Button Value
                </h5>
                <button
                  type="button"
                  className="btn-close btnCloseSetbtn"
                  onClick={closeButtonValueModal}
                >
                  <img
                    src="/imgs/closeIcon.svg"
                    alt="close"
                    style={{
                      width: isMobile ? "12px" : "15px",
                      height: isMobile ? "12px" : "15px",
                    }}
                  />
                </button>
              </div>

              <div className="modal-body p-0">
                <ButtonValues />
              </div>

              {/* <div className="modal-footer">
                                    <button
                                      className="btn btn-secondary"
                                      onClick={closeButtonValueModal}
                                    >
                                      Close
                                    </button>
                                  </div> */}
            </div>
          </div>
        </div>
      )}
      <div className="modal-market" />
      {/* @ts-ignore Server Component */}
      <ReactModal
        isOpen={isOpen}
        onRequestClose={(e: any) => {
          setIsOpen(false);
        }}
        contentLabel="Set Max Bet Limit"
        className={"modal-dialog"}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            My Market
            <button
              onClick={() => setIsOpen(false)}
              className="close float-right"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            <table className="reponsive table col-12">
              <tr>
                <th>Event Name</th>
                <th>Total Bets</th>
              </tr>

              {getExposerEvent.map((exposer: any) => {
                let casinoSlug = "";
                if (exposer.sportId == 5000) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  casinoSlug = casinoSlugs?.[exposer?.matchId];
                }
                return (
                  <tr key={exposer.matchName}>
                    <td>
                      <CustomLink
                        onClick={() => {
                          window.location.href =
                            exposer.sportId &&
                            Number.isInteger(+exposer.sportId) &&
                            exposer.sportId != 5000
                              ? `/odds/${exposer._id}`
                              : `/casino/${casinoSlug}/${exposer._id}`;
                          setIsOpen(false);
                        }}
                        to={
                          exposer.sportId &&
                          Number.isInteger(+exposer.sportId) &&
                          exposer.sportId != 5000
                            ? `/odds/${exposer._id}`
                            : `/casino/${casinoSlug}/${exposer._id}`
                        }
                      >
                        {exposer.matchName}
                      </CustomLink>
                    </td>
                    <td>{exposer.myCount}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </ReactModal>

      {/* @ts-ignore Server Component */}
      <ReactModal
        isOpen={isOpenRule}
        onRequestClose={(e: any) => {
          setIsOpenRule(false);
        }}
        contentLabel="Set Max Bet Limit"
        className={"modal-dialog w-90P"}
        ariaHideApp={false}
      >
        <div
          className="modal-content"
          style={{ height: "90vh", marginTop: "1%" }}
        >
          <div className="modal-header">
            Rules
            <button
              onClick={() => setIsOpenRule(false)}
              className="close float-right"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            <Rules classData={"col-md-12"} />
          </div>
        </div>
      </ReactModal>
    </header>
  );
};
export default Header;
