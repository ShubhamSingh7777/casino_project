import { useParams } from "react-router-dom";
import ISport from "../../../models/ISport";
import { useAppSelector } from "../../../redux/hooks";
import { selectSportList } from "../../../redux/actions/sports/sportSlice";
import { CustomLink } from "./custom-link";
import { isMobile } from "react-device-detect";

const NavMenu = () => {
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);
  const { sportId } = useParams();
  const order = ["Cricket", "Tennis", "Football", "Table Tennis", "Baccarat"];

  const firstSports = order
    .map((name) => sportListState.sports.find((sport) => sport.name === name))
    .filter(Boolean) as ISport[];

  const remainingSports = sportListState.sports.filter(
    (sport) => !order.includes(sport.name),
  );
  return (
    <div className="header-bottom m-t-1 col-md-12">
      <nav className="navbar navbar-expand-md btco-hover-menu">
        <button
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
          className="navbar-toggler"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse">
          <ul className="list-unstyled navbar-nav">
            <li className="nav-item active">
              <CustomLink
                to={"/"}
                className="router-link-exact-active router-link-active"
              >
                Home
              </CustomLink>
            </li>
            <li className="nav-item">
              <CustomLink
                to={"/match/4/in-play"}
                className="router-link-exact-active router-link-active"
                style={{ padding: "5px 15px" }}
              >
                Lottery
              </CustomLink>
            </li>
            {/* First sports */}
            {firstSports.map((sport) => (
              <li key={sport._id} className="nav-item">
                <CustomLink
                  to={`/match/${sport.sportId}`}
                  className={`nav-link ${
                    sportId == sport.sportId ? "router-link-active" : ""
                  }`}
                >
                  {sport.name}
                </CustomLink>
              </li>
            ))}
            {/* <li className='nav-item active'>
              <CustomLink to={'/match/4/in-play'} className='router-link-exact-active router-link-active'>
                <b>Inplay</b>
              </CustomLink>
            </li> */}
            <li className="nav-item">
              <CustomLink
                to={"casino-in/live-dmd?category=Baccarat"}
                className="router-link-exact-active router-link-active"
                style={{ padding: "5px 15px" }}
              >
                Baccarat
              </CustomLink>
            </li>
            <li className="nav-item">
              <CustomLink
                to={"casino-in/live-dmd?category=32%20Cards"}
                className="router-link-exact-active router-link-active"
                style={{ padding: "5px 15px" }}
              >
                32 Cards
              </CustomLink>
            </li>
            <li className="nav-item">
              <CustomLink
                to={"casino-in/live-dmd?category=Teenpatti"}
                className="router-link-exact-active router-link-active"
                style={{ padding: "5px 15px" }}
              >
                Teenpatti
              </CustomLink>
            </li>
            <li className="nav-item">
              <CustomLink
                to={"casino-in/live-dmd?category=Poker"}
                className="router-link-exact-active router-link-active"
                style={{ padding: "5px 15px" }}
              >
                Poker
              </CustomLink>
            </li>
            <li className="nav-item">
              <CustomLink
                to={"casino-in/live-dmd?category=Lucky%207"}
                className="router-link-exact-active router-link-active"
                style={{ padding: "5px 15px" }}
              >
                Lucky 7
              </CustomLink>
            </li>
            <li className="nav-item" style={{ marginRight: "0rem" }}>
              <img
                className="aviator-zoom-main"
                src="/imgs/aviator.webp"
                alt=""
                style={{ width: "45px" }}
              />
              <CustomLink
                to={"/casino-int/all?category=Spribe"}
                className="router-link-exact-active router-link-active"
                style={{ padding: isMobile ? "" : "0px 10px 5px 2px" }}
              >
                CRASH
              </CustomLink>
            </li>
            {/* {sportListState.sports.map((sport: ISport) => ( */}
            {/* {sortedSports.map((sport: ISport) => (
              <li key={sport._id} className='nav-item'>
                <CustomLink
                  to={`/match/${sport.sportId}`}
                  className={`nav-link ${sportId == sport.sportId ? 'router-link-active' : ''}`}
                >
                 {sport.name}
                </CustomLink>
              </li>
            ))} */}
            {remainingSports.map((sport) => (
              <li key={sport._id} className="nav-item">
                <CustomLink
                  to={`/match/${sport.sportId}`}
                  className={`nav-link ${
                    sportId == sport.sportId ? "router-link-active" : ""
                  }`}
                >
                  {sport.name}
                </CustomLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default NavMenu;
