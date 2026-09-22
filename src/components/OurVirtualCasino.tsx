import { AxiosResponse } from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { isMobile } from "react-device-detect";

import { CustomLink } from "../pages/_layout/elements/custom-link";
import { useAppSelector } from "../redux/hooks";
import {
  selectCasinoMatchList,
  selectPremiumCasinoList,
  selectVirtualCasinoList,
  setHomePageCasinoMatch,
  setPremiumCasinoMatch,
  setVirtualCasinoMatch,
} from "../redux/actions/casino/casinoSlice";
import casinoService from "../services/casino.service";
import CasinoListItemPremium from "../pages/CasinoList/CasinoListItemPremium";
import CasinoListItenVirtual from "../pages/CasinoList/CasinoListItenVirtual";

const OurVirtualCasino = () => {
  const dispatch = useDispatch();

  const gamesList = useAppSelector(selectCasinoMatchList);
  const virtualGames = useAppSelector(selectVirtualCasinoList);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const category = searchParams.get("category") || "all";

  // Completely custom categories
  const customCategories = [
    {
      name: "All Casino",
      value: "all",
    },
    {
      name: "Teen Patti",
      value: "teen-patti",
    },
    {
      name: "Dragon Tiger",
      value: "dragon tiger",
    },
    {
      name: "Lucky 7",
      value: "lucky 7",
    },
    {
      name: "Bollywood",
      value: "bollywood",
    },
    {
      name: "Others",
      value: "others",
    },
  ];

  // React.useEffect(() => {
  //   if (gamesList.length <= 0) {
  //     casinoService.getCasinoList().then((res: AxiosResponse) => {
  //       dispatch(setHomePageCasinoMatch(res.data.data));
  //     });
  //   }
  // }, [gamesList.length, dispatch]);

  React.useEffect(() => {
    if (virtualGames.length === 0) {
      casinoService.getVirtualCasinoList().then((res: AxiosResponse) => {
        console.log("Virtual Casino API Response:", res);
        console.log("Virtual Casino API Data:", res.data);
        console.log("Virtual Casino Games:", res.data.data);

        dispatch(setVirtualCasinoMatch(res.data.data));
      });
    }
  }, [virtualGames.length, dispatch]);
  return (
    <div
      className={`container-fluid ${
        !isMobile ? "container-fluid-5" : "container-fluid-0"
      } cas-in-list`}
    >
      {/* Mobile menu */}
      {isMobile && (
        <div
          className="row row5"
          style={{
            marginLeft: "0px",
            marginRight: "0px",
          }}
        >
          <div
            className="col-xl-12 d-xl-flex"
            style={{
              marginTop: "0px",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
          >
            <ul
              className="nav nav-pills casino-sub-tab casino-menu-custom"
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                overflowX: "scroll",
                background: "#2C3E50",
              }}
            >
              <CustomLink
                className={`nav-link ${
                  location.pathname === "" ? "active" : ""
                }`}
                to=""
              >
                Our Casino
              </CustomLink>

              <CustomLink
                className={`nav-link ${
                  location.pathname === "/casino-in/our-vi" ? "active" : ""
                }`}
                to="/casino-in/our-vi"
              >
                Our VIP Casino
              </CustomLink>

              <CustomLink
                className={`nav-link ${
                  location.pathname === "/casino-in/our-premium" ? "active" : ""
                }`}
                to="/casino-in/our-premium"
              >
                Our Premium Casino
              </CustomLink>

              <CustomLink
                className={`nav-link ${
                  location.pathname === "/casino-in/our-virtual" ? "active" : ""
                }`}
                to="/casino-in/our-virtual"
              >
                Our Virtual
              </CustomLink>
            </ul>
          </div>
        </div>
      )}

      <div className="row row5">
        {/* Custom Categories */}
        <div
          className="col-xl-2 col-12 d-xl-flex"
          style={{
            marginTop: isMobile ? "0px" : "4px",
            paddingLeft: "0px",
            paddingRight: "0px",
          }}
        >
          <ul
            className="nav nav-pills categories-live casino-sub-tab"
            style={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              flexWrap: "nowrap",
              overflowX: isMobile ? "scroll" : "auto",
              background: isMobile ? "#0088CC" : "#2C3E50",
            }}
          >
            {customCategories.map((item) => (
              <CustomLink
                key={item.value}
                className={`nav-link ${
                  category === item.value ? "active" : ""
                }`}
                to={`/casino-in/our-virtual?category=${item.value}`}
              >
                {item.name}
              </CustomLink>
            ))}
          </ul>
        </div>

        {/* Custom Games */}
        <div
          className="col-xl-10 col-12"
          style={{
            paddingRight: isMobile ? "0px" : "",
            paddingLeft: isMobile ? "0px" : "",
          }}
        >
          <div
            className={`casino-list casino-list-itemNew ${
              !isMobile ? "mt-1" : "mt-2"
            }`}
          >
            <CasinoListItenVirtual category={category} games={virtualGames} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurVirtualCasino;
