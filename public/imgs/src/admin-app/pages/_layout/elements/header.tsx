import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { Tree } from "antd";
import axios, { AxiosResponse } from "axios";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import ISport from "../../../../models/ISport";
import User, { RoleType } from "../../../../models/User";
import {
  CustomLink,
  useNavigateCustom,
} from "../../../../pages/_layout/elements/custom-link";
import {
  logout,
  selectUserData,
  userUpdate,
} from "../../../../redux/actions/login/loginSlice";
import { selectSportList } from "../../../../redux/actions/sports/sportSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import casinoService from "../../../../services/casino.service";
import sportsService from "../../../../services/sports.service";
import userService from "../../../../services/user.service";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import Marqueemessge from "./welcome";
import { DataNode } from "antd/es/tree";
import { set } from "lodash";
import { isMobile } from "react-device-detect";

const Header = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const dispatch = useAppDispatch();

  const navigate = useNavigateCustom();

  const [showMenu, setShowMenu] = React.useState<boolean>(false);
  const [treeData, setTreeData] = React.useState<any>([]);
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const sportsList = useAppSelector(selectSportList);

  const [userMessage, setUserMessage] = React.useState<string>("");

  const [isOpen, setIsOpen] = React.useState(false);
  const [gameList, setGameList] = React.useState([]);
  const [virtualGameList, setVirtualGameList] = React.useState([]);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
    //changesfordropdown
  const dropdownWrapperRef = useRef<HTMLUListElement | null>(null);
  const userDropdownRef = useRef<HTMLLIElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    setOpenDropdown(null);
    setShowMenu(false);
  }, [location.pathname]);

  React.useEffect(() => {
    axios
      .get(`adminMessage.json?v=${Date.now()}`)
      .then((res: AxiosResponse) => {
        setUserMessage(res.data.message);
      });
  }, []);

  React.useEffect(() => {
    if (gameList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        setGameList(res.data.data);
      });
  }, []);
    React.useEffect(() => {
    if (virtualGameList.length <= 0)
      casinoService.getVirtualCasinoList().then((res: AxiosResponse<any>) => {
        setVirtualGameList(res.data.data);
      });
  }, []);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
    setTreeData(
      sportsList.sports.map((sport: ISport) => ({
        title: sport.name,
        key: sport.sportId,
      }))
    );
  };

  const logoutUser = (e: any) => {
    e.preventDefault();
    dispatch(userUpdate({} as User));
    setTimeout(() => {
      dispatch(logout());
      navigate.go("/login");
    }, 1);
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    return userService.getUserListSuggestion({ username: value });
  };

  const onSelectUser = (user: any) => {
    navigate.go(`/list-clients/${user.username}?search=true`);
  };

  const selectExpend = (item: any) => {
    if (item.matchId) {
      setIsOpen(false);
      window.location.href = `/admin/odds/${item.matchId}`;
    }
  };

  const updateTreeData = (
    list: DataNode[],
    key: React.Key,
    children: DataNode[]
  ): DataNode[] =>
    list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });

  const onLoadData = (data: any) => {
    if (data.matchId) {
      selectExpend(data);
      return Promise.resolve();
    }
    return sportsService.getSeriesWithMatch(data.key).then((series: any) => {
      const items = series.data.data.map((series: any) => {
        const { id, name } = series.competition;
        const matchNodes = series.matches.map((match: any) => {
          return {
            key: match.event.id,
            title: match.event.name,
            matchId: match.event.id,
          };
        });
        return {
          key: id,
          title: name,
          children: matchNodes,
        };
      });
      setTreeData((origin: any) => {
        return updateTreeData(origin, data.key, items);
      });

      return items;
    });
  };

    //changesfordropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <div className="header-bottom">
          <div className="container-fluid">
            <CustomLink to={"/"} className="logo">
              <img src="/imgs/logo.png" style={{maxHeight:isMobile?'30px':''}}/>
            </CustomLink>
            <div className="side-menu-button" onClick={toggleDrawer} style={{left:isMobile?'92px':''}}>
              {/* <div className="bar1" />
              <div className="bar2" />
              <div className="bar3" /> */}
              <i className="fa fa-fw fa-bars" style={{fontSize: "16px"}}></i>
            </div>
            <nav className="navbar navbar-expand-md btco-hover-menu">
              <div
                className="collapse navbar-collapse"
                style={{ overflowX: "unset" }}
              >
                <ul className="list-unstyled navbar-nav"  ref={dropdownWrapperRef} style={{paddingLeft:isMobile?'99px':''}}>
                  <li className="nav-item">
                    <CustomLink to={"/list-clients"} style={{padding:isMobile?'10px 4px':''}}>
                      <b>List of Clients</b>
                    </CustomLink>
                  </li>
                  <li className="nav-item">
                    <CustomLink to={"/market-analysis"} style={{padding:isMobile?'10px 4px':''}}>
                      <b>Market Analysis</b>
                    </CustomLink>
                  </li>
                     <li className="nav-item dropdown custom-dropdown-header">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdown((prev) =>
                          prev === "casino" ? null : "casino"
                        );
                      }}
                      style={{padding:isMobile?'10px 4px':''}}
                    >
                      <b>Live Market</b> <i className="fa fa-caret-down" />
                    </a>
                    <ul
                      className={`dropdown-menu ${
                        openDropdown === "casino" ? "show" : ""
                      }`}
                      style={{ height: "400px", overflowY: "scroll" }}
                    >
                      {gameList?.length > 0 &&
                        gameList.map((Item: any, key: number) => {
                          return (
                            <li key={key}>
                              <CustomLink
                                to={`/casino/${Item.slug}`}
                                className="dropdown-item"
                              >
                                <b>{Item.title}</b>
                              </CustomLink>
                            </li>
                          );
                        })}
                    </ul>
                  </li>
                  <li className="nav-item dropdown custom-dropdown-header">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdown((prev) =>
                          prev === "vcasino" ? null : "vcasino"
                        );
                      }}
                      style={{padding:isMobile?'10px 4px':''}}
                    >
                      <b>Live Virtual Market</b> <i className="fa fa-caret-down" />
                    </a>
                    <ul
                      className={`dropdown-menu ${
                        openDropdown === "vcasino" ? "show" : ""
                      }`}
                      style={{ height: "320px", overflowY: "scroll" }}
                    >
                      {virtualGameList?.length > 0 &&
                        virtualGameList.map((Item: any, key: number) => {
                          return (
                            <li key={key}>
                              <CustomLink
                                to={`/casino/${Item.slug}`}
                                className="dropdown-item"
                              >
                                <b>{Item.title}</b>
                              </CustomLink>
                            </li>
                          );
                        })}
                    </ul>
                  </li>
                  <li className="nav-item dropdown custom-dropdown-header">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdown((prev) =>
                          prev === "reports" ? null : "reports"
                        );
                      }}
                      style={{padding:isMobile?'10px 4px':''}}
                    >
                      <b>Reports</b> <i className="fa fa-caret-down" />
                    </a>
                    <ul
                      className={`dropdown-menu ${
                        openDropdown === "reports" ? "show" : ""
                      }`}
                    >
                      <li>
                        <CustomLink
                          to="/accountstatement"
                          className="dropdown-item"
                        >
                          <b>{"Account's Statement"}</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink
                          to="/unsettledbet"
                          className="dropdown-item"
                        >
                          <b>Current Bets</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink
                          to="/all-bets"
                          className="dropdown-item"
                        >
                          <b>All Bets</b>
                        </CustomLink>
                      </li>
                      {userState?.user?.role === RoleType.admin && (
                        <li>
                          <CustomLink
                            to="/unsettledbet/deleted"
                            className="dropdown-item"
                          >
                            <b>Deleted Bets</b>
                          </CustomLink>
                        </li>
                      )}
                      {/* <li>
                        <a href='greport.html' className='dropdown-item'>
                          <b>General Report</b>
                        </a>
                      </li> */}
                      <li>
                        <CustomLink
                          to="/game-reports"
                          className="dropdown-item"
                        >
                          <b>Game Reports</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink to="/profitloss" className="dropdown-item">
                          <b>Profit And Loss</b>
                        </CustomLink>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown custom-dropdown-header">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdown((prev) =>
                          prev === "transactions" ? null : "transactions"
                        );
                      }}
                      style={{padding:isMobile?'10px 4px':''}}
                    >
                      <b>Transactions</b> <i className="fa fa-caret-down" />
                    </a>
                    <ul
                      className={`dropdown-menu ${
                        openDropdown === "transactions" ? "show" : ""
                      }`}
                    >
                      <li>
                        <CustomLink
                          to="/depositstatement"
                          className="dropdown-item"
                        >
                          <b>{"Deposit"}</b>
                        </CustomLink>
                      </li>
                      <li>
                        <CustomLink
                          to="/withdrawstatement"
                          className="dropdown-item"
                        >
                          <b>{"Withdrawals"}</b>
                        </CustomLink>
                      </li>
                    </ul>
                  </li>
               

                  <li className="nav-item dropdown custom-dropdown-header">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenDropdown((prev) =>
                          prev === "settings" ? null : "settings"
                        );
                      }}
                      style={{padding:isMobile?'10px 4px':''}}
                    >
                      <b>Settings</b> <i className="fa fa-caret-down" />
                    </a>
                    <ul
                      className={`dropdown-menu ${
                        openDropdown === "settings" ? "show" : ""
                      }`}
                    >
                      {userState?.user?.role === RoleType.admin && (
                        <>
                          <li>
                            <CustomLink
                              to="/sports-list/active-matches"
                              className="dropdown-item"
                            >
                              <b>{"Block Markets"}</b>
                            </CustomLink>
                          </li>
                          <li>
                            <CustomLink
                              to="/messages"
                              className="dropdown-item"
                            >
                              <b>{"Messages"}</b>
                            </CustomLink>
                          </li>
                          <li>
                            <CustomLink
                              to={"/sports-list/matches"}
                              className="dropdown-item"
                            >
                              <b>Add Match List</b>
                            </CustomLink>
                          </li>

                          <li>
                            <CustomLink
                              to="/casino-list"
                              className="dropdown-item"
                            >
                              <b>{"Casino List"}</b>
                            </CustomLink>
                          </li>
                          <li onClick={() => setOpenDropdown(null)}>
                            <CustomLink
                              to="/system-logs"
                              className="dropdown-item"
                            >
                              <b>{"System Logs"}</b>
                            </CustomLink>
                          </li>
                        </>
                      )}

                      <li>
                        <CustomLink
                          to="/payment-method"
                          className="dropdown-item"
                        >
                          <b>{"Payment Method"}</b>
                        </CustomLink>
                      </li>
                      <li onClick={() => setOpenDropdown(null)}>
                        <CustomLink
                          to="/Contact-details"
                          className="dropdown-item"
                        >
                          <b>{"Contact Details"}</b>
                        </CustomLink>
                      </li>
                      {/* Agent Management — SuperAdmin and Admin */}
                      {(userState?.user?.role === RoleType.admin || userState?.user?.role === RoleType.sadmin) && (
                        <li onClick={() => setOpenDropdown(null)}>
                          <CustomLink
                            to="/agent-management"
                            className="dropdown-item"
                          >
                            <b style={{ color: '#e74c3c' }}>
                              <i className="fas fa-user-shield mr-1" />
                              {"Agent Management"}
                            </b>
                          </CustomLink>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
            <ul className="user-search list-unstyled">
              <li className="username" ref={userDropdownRef}>
                <span onClick={() => setShowMenu(!showMenu)}>
                  {userState?.user?.username} <i className="fa fa-caret-down" />
                </span>
                <ul style={{ display: showMenu ? "block" : "none" }}>
                  <li>
                    <CustomLink to="/change-password">
                      <b>Change Password</b>
                    </CustomLink>
                  </li>
                  <li>
                    <a onClick={logoutUser} href="#">
                      <b>Logout</b>
                    </a>
                  </li>
                </ul>
              </li>
              <li className="search">
                <CustomAutoComplete
                  onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                  onSelectUser={onSelectUser}
                  placeHolder={"All Client"}
                  style={{width:isMobile?'120px':''}}
                />
                    <a id='clientList' data-value='' href='#'>
                  <i className='fas fa-search-plus' />
                </a>
                {/* <input id='tags' type='text' name='list' placeholder='All Client' />
                <a id='clientList' data-value='' href='#'>
                  <i className='fas fa-search-plus' />
                </a> */}
              </li>
            </ul>
            {/* <Marqueemessge message={userMessage}></Marqueemessge> */}
          </div>
        </div>
      </header>
      <Drawer open={isOpen} onClose={toggleDrawer} direction="left">
        <div className="drawer-header" style={{background:'none'}}>
          {/* <img src="/imgs/logo.png" className="wd-100" /> */}
          <span style={{fontSize: '2rem',fontWeight: '500',padding:'5px 12px'}}>Sports</span>
        </div>
        <div className="drawer-content">
          <Tree
            loadData={onLoadData}
            treeData={treeData}
            onSelect={(selectedKeys, e) => {
              selectExpend(e.node);
            }}
          />
        </div>
      </Drawer>
    </>
  );
};
export default Header;
