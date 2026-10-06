import { AxiosResponse } from "axios";
import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import CasinoListItem from "../CasinoList/CasinoListItem";
import casinoService from "../../services/casino.service";
import {
  selectCasinoMatchList,
  setHomePageCasinoMatch,
} from "../../redux/actions/casino/casinoSlice";
import CasinoListItem2 from "../CasinoList/CasinoListItem2";
import { casinoNavItems } from "../../utils/constants";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { CustomLink } from "../_layout/elements/custom-link";
import { isMobile } from "react-device-detect";

const Casino = () => {
  const dispatch = useDispatch();
  const gamesList = useAppSelector<any>(selectCasinoMatchList);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryp = useParams();
  const category = searchParams.get("category");
  console.log(queryp);
  console.log(category);
  React.useEffect(() => {
    if (gamesList.length <= 0)
      casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
        dispatch(setHomePageCasinoMatch(res.data.data));
      });
  }, [category]);
  return (
    <>
      <div
        className={`container-fluid ${
          !isMobile ? "container-fluid-5" : "container-fluid-0"
        } cas-in-list`}
      >
        {isMobile ? (
          <div
            className="row row5"
            style={{
              marginLeft: isMobile ? "0px" : "",
              marginRight: isMobile ? "0px" : "",
            }}  
          >
            <div
              className="col-xl-12 d-xl-flex "
              style={{
                marginTop: isMobile ? "0px" : "5px",
                paddingLeft: isMobile ? "0px" : "",
                paddingRight: isMobile ? "0px" : "",
              }}
            >
              <ul
                className="nav nav-pills casino-sub-tab casino-menu-custom"
                style={{
                  display: "flex !important",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  overflowX: "scroll",
                  background: "#2C3E50",
                }}
              >
                <li className="nav-item">
                  <CustomLink
                    className={`nav-link ${
                      location.pathname === "/casino-in/live-dmd"
                        ? "active"
                        : ""
                    }`}
                    to={`/casino-in/live-dmd`}
                  >
                    <span>Our Casino</span>
                  </CustomLink>
                </li>
                <li className="nav-item">
                  <CustomLink
                    className={`nav-link ${
                      location.pathname === "/casino-in/our-vip"
                        ? "active"
                        : ""
                    }`}
                    to={`/casino-in/our-vip`}
                  >
                    <span>Our VIP Casino</span>
                  </CustomLink>
                </li>
                <li className="nav-item">
                  <CustomLink
                    className={`nav-link ${
                      location.pathname === "/casino-in/our-premium"
                        ? "active"
                        : ""
                    }`}
                    to={`/casino-in/our-premium`}
                  >
                    <span>Our Premium Casino</span>
                  </CustomLink>
                </li>
                <li className="nav-item">
                  <CustomLink
                    className={`nav-link ${
                      location.pathname === "/casino-in/our-virtual"
                        ? "active"
                        : ""
                    }`}
                    to={`/casino-in/our-virtual`}
                  >
                    <span>Our Virtual</span>
                  </CustomLink>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className="row row5"
          style={{
            marginLeft: isMobile ? "0px" : "",
            marginRight: isMobile ? "0px" : "",
          }}
        >
          <div
            className="col-xl-2 col-12 d-xl-flex "
            style={{
              marginTop: isMobile ? "0px" : "4px",
              paddingLeft: isMobile ? "0px" : "0px",
              paddingRight: isMobile ? "0px" : "0px",
            }}
          >
            <ul
              className="nav nav-pills categories-live casino-sub-tab"
              style={{
                display: "flex !important",
                flexDirection:isMobile? "row":"column",
                flexWrap: "nowrap",
                overflowX:isMobile? "scroll" : "auto",
                background:isMobile?"#0088CC":"#2C3E50"
              }}
            >
              {casinoNavItems.map((Item: any, key: number) => {
                return (
                  <li className="nav-item" key={key}>
                    <CustomLink
                      className={`nav-link ${
                        Item.name == category ||
                        (!category && Item.name == "All Casino")
                          ? "active"
                          : ""
                      }`}
                      to={`/casino-in/live-dmd?category=${Item.name}`}
                    >
                      <span>{Item.name}</span>
                    </CustomLink>
                  </li>
                );
              })}
            </ul>
          </div>
        
        
          <div className="col-xl-10 col-12" style={{paddingRight:isMobile?'0px':'',paddingLeft:isMobile?'0px':''}}>
            <div className={`casino-list casino-list-itemNew ${!isMobile ? "mt-1" : "mt-2"}`}>
              <CasinoListItem2 />
            </div>
        </div>
        </div>
      </div>
    </>
  );
};
export default Casino;
