import { AxiosResponse } from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { isMobile } from "react-device-detect";

import { CustomLink } from "../pages/_layout/elements/custom-link";
import { useAppSelector } from "../redux/hooks";
import {
  selectCasinoMatchList,
  setHomePageCasinoMatch,
} from "../redux/actions/casino/casinoSlice";
import casinoService from "../services/casino.service";
import CustomCasinoListItem from "../pages/CasinoList/CustomCasinoListItem";

const OurVipCasino = () => {
  const dispatch = useDispatch();

  const gamesList = useAppSelector(selectCasinoMatchList);

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
    }
  ];

  React.useEffect(() => {
    if (gamesList.length <= 0) {
      casinoService.getCasinoList().then((res: AxiosResponse) => {
        dispatch(setHomePageCasinoMatch(res.data.data));
      });
    }
  }, [gamesList.length, dispatch]);

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
                  location.pathname === "/casino-in/live-dmd"
                    ? "active"
                    : ""
                }`}
                to="/casino-in/live-dmd"
              >
                Our Casino
              </CustomLink>

              <CustomLink
                className={`nav-link ${
                  location.pathname === "/casino-in/our-vi"
                    ? "active"
                    : ""
                }`}
                to="/casino-in/our-vi"
              >
                Our VIP Casino
              </CustomLink>

              <CustomLink
                className={`nav-link ${
                  location.pathname === "/casino-in/our-premium"
                    ? "active"
                    : ""
                }`}
                to="/casino-in/our-premium"
              >
                Our Premium Casino
              </CustomLink>

              <CustomLink
                className={`nav-link ${
                  location.pathname === "/casino-in/our-virtual"
                    ? "active"
                    : ""
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
                to={`/casino-in/our-vip?category=${item.value}`}
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
            <CustomCasinoListItem category={category} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurVipCasino;