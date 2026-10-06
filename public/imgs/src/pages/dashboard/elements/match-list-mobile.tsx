import React, { Fragment } from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../redux/hooks";
import { selectCasinoMatchList } from "../../../redux/actions/casino/casinoSlice";

const MatchListMobile = (props: any) => {
  const location = useLocation();
  const { sportId } = useParams<{ sportId: string }>();
  const [selectedSeries, setSelectedSeries] = React.useState<string | null>(
    null,
  );

  const addISTOffset = (iso: any) => {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() + 120);
    return d.toISOString();
  };

  // Determine active sport
  const activeSportId = sportId ? Number(sportId) : props.matchList[0]?.sportId;
  const HORSE_RACING_ID = 10 ;
  const GREY_HOUND_RACING = 65;
  const isHorseRacing = activeSportId === HORSE_RACING_ID ||
  activeSportId === GREY_HOUND_RACING;

  // Filter matches for active sport only
  // const filteredMatches = props.matchList.filter(
  //   (match: LMatch) => match.sportId === activeSportId,
  // );
  const filteredMatches = props.matchList.filter((match: LMatch) => {
  if (match.sportId !== activeSportId) return false;

  const matchDate = new Date(match.matchDateTime);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const matchDay = new Date(matchDate);
  matchDay.setHours(0, 0, 0, 0);

  return matchDay >= yesterday;
});
  const navigate = useNavigate();
  // Check login
  const isLoggedIn = !!localStorage.getItem("token");
  const isMatch4 = location.pathname.includes("match/4");
  const casinoList = useAppSelector<any>(selectCasinoMatchList);
  const superOver2 = React.useMemo(() => {
    return casinoList?.filter((item: any) => item.slug === "superover2") || [];
  }, [casinoList]);
  const { marketData } = props;
  const handleMatchClick = (match: LMatch) => {
    if (!isLoggedIn) {
      toast.error("Please login first", { duration: 3000 });
      return;
    }
    props.currentMatch(match);
  };
  // Only horse racing matches
  // const horseRacingMatches = filteredMatches.filter(
  //   (m: any) => m.sportId === 10,
  // );
  const horseRacingMatches = filteredMatches.filter(
  (m: any) =>
    m.sportId === HORSE_RACING_ID ||
    m.sportId === GREY_HOUND_RACING
);
  // Group matches by series
  const seriesMap = horseRacingMatches.reduce((acc: any, match: any) => {
    const series = match.series || "Others";
    if (!acc[series]) acc[series] = [];
    acc[series].push(match);
    return acc;
  }, {});
  React.useEffect(() => {
    if (isHorseRacing && !selectedSeries) {
      const firstSeries = Object.keys(seriesMap)[0];
      setSelectedSeries(firstSeries);
    }
  }, [isHorseRacing, seriesMap]);
  const seriesFilteredMatches = selectedSeries
    ? seriesMap[selectedSeries] || []
    : horseRacingMatches;
  const matchesToRender = isHorseRacing
    ? seriesFilteredMatches // horse racing → series filtered
    : filteredMatches; // normal sports
  const horseRacingGroupedByName = React.useMemo(() => {
    if (!isHorseRacing) return {};

    return matchesToRender.reduce((acc: any, match: any) => {
      const name = match.name;

      if (!acc[name]) acc[name] = [];
      acc[name].push(match);

      return acc;
    }, {});
  }, [isHorseRacing, matchesToRender]);
  const getSuperOverRunners = (item: any) => {
    return item?.markets?.find(
      (m: any) => m.marketName === "MATCH_ODDS" || m.marketName === "SUPEROVER",
    )?.runners;
  };
  return (
    <div
      className={`card-content mobile-match ${
        isHorseRacing ? "mobile-match-horseracing" : ""
      }`}
      style={
        location.pathname.includes("in-play")
          ? { maxHeight: "300px", overflowY: "scroll" }
          : {}
      }
    >
      <table className="table coupon-table coupon-table-mobile">
        {isHorseRacing && (
          <div style={{ width: "100%", padding: "0px" }}>
            <div
              style={{
                display: "flex",
                gap: "0px",
                overflowX: "auto",
              }}
            >
              {Object.keys(seriesMap).map((series) => (
                <button
                  key={series}
                  onClick={() => setSelectedSeries(series)}
                  style={{
                    padding: ".5rem 1rem",
                    borderRadius: "0px",
                    borderLeft: "1px solid #2C3E50",
                    background:
                      selectedSeries === series ? "#2C3E50" : "#cccccc",
                    color: selectedSeries === series ? "#fff" : "#000",
                    fontSize: "16px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    width: "unset",
                    height: "auto",
                    minWidth: "unset",
                  }}
                >
                  {series}
                </button>
              ))}
            </div>
          </div>
        )}

        <tbody>
          {isMatch4 &&
            superOver2.length > 0 &&
            superOver2.map((Item: any) => {
              const runners = getSuperOverRunners(Item);

              return (
                <>
                  <tr key={Item.match_id}>
                    <td colSpan={6} style={{ padding: "1px 6px" }}>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="game-name" style={{ fontSize: "12px" }}>
                          <a
                            onClick={(e) => {
                              e.preventDefault();

                              const isLoggedIn =
                                !!localStorage.getItem("token");
                              if (!isLoggedIn) {
                                toast.error("Please login first");
                                return;
                              }

                              navigate(`/casino/${Item.slug}/${Item.match_id}`);
                            }}
                            className="text-dark"
                            style={{ fontSize: "12px" }}
                          >
                            {Item.title || "Super Over 2"}
                          </a>
                        </div>

                        <div className="game-icons d-flex align-items-center">
                          <span
                            className="active"
                            style={{ width: "10px", height: "10px" }}
                          />
                          <img
                            src="/tv-icon.png"
                            alt="icon-tv"
                            className="icon-tv"
                            style={{width:'10px',height:'10px'}}
                          />
                        </div>
                      </div>
                    </td>
                    {/* 🔥 SAME ODDS UI */}
                    {/* {memoOdds(runners)} */}
                  </tr>
                  <tr
                    className="memooddsmob"
                    style={{ borderBottom: "1px solid #c7c8ca" }}
                  >
                    {props.memoOdds(runners)}
                  </tr>
                </>
              );
            })}
          {/* ===== HORSE RACING ===== */}
          {isHorseRacing ? (
            Object.entries(horseRacingGroupedByName).length > 0 ? (
              Object.entries(horseRacingGroupedByName).map(
                ([name, races]: any) => (
                  <Fragment key={name}>
                    {/* NAME ROW (ONLY ONCE) */}
                    <tr>
                      <td colSpan={6}>
                        <div
                          className="game-name fw-600"
                          style={{
                            margin: "8px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src="/tv-icon.png"
                            alt=""
                            style={{ width: "16px", marginRight: "6px" }}
                          />
                          {name}
                        </div>
                      </td>
                    </tr>

                    {/* TIMES ROW (ALL TIMES IN ONE ROW) */}
                    <tr>
                      <td colSpan={6}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            margin: "0 8px 8px",
                            borderBottom: "1px solid #c7c8ca",
                            paddingBottom: "6px",
                          }}
                        >
                          {races.map((race: any) => (
                            <span
                              key={race.matchId}
                              onClick={() => handleMatchClick(race)}
                              style={{
                                padding: "5px 10px",
                                border: "1px solid #ccc",
                                background: "#ccc",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {moment
                                .utc(addISTOffset(race.matchDateTime))
                                .format("HH:mm")}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ),
              )
            ) : (
              <tr>
                <td colSpan={6} className="text-center bg-gray p10">
                  No Match Found
                </td>
              </tr>
            )
          ) : /* ===== NORMAL SPORTS ===== */
          filteredMatches.length > 0 ? (
            filteredMatches.map((match: LMatch) => {
              const localTime = new Date(match.matchDateTime.replace("Z", ""));
              const runners = match?.markets?.find(
                (m) => m.marketName === "MATCH_ODDS",
              )?.runners;

              return (
                <Fragment key={match.matchId}>
                  <tr>
                    <td colSpan={4} style={{ padding: "0px 4px 0px 0px" }}>
                      <div className="game-name">
                        <a
                          onClick={() => handleMatchClick(match)}
                          className="text-edark"
                        >
                          {match.name}
                        </a>
                        <p className="tx-666 tx-12">
                          {moment
                            .utc(addISTOffset(match.matchDateTime))
                            .format("DD-MM-YYYY HH:mm")}
                        </p>
                      </div>
                    </td>

                    <td colSpan={2}>
                     <div className="game-icons">
                        {localTime.getTime() < Date.now() && (
                          // <span className="game-icon">
                          //   <i className="fas fa-circle tx-green" />
                          // </span>
                          <span
                            className="active"
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: "#28a745",
                              marginRight: "6px",
                            }}
                          />
                        )}
                        {match.inPlay && (
                        <div
                          style={{
                            width: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src="/tv-icon.png"
                            alt="icon-tv"
                            className="icon-tv"
                            style={{ width: "10px", height: "10px" }}
                          />
                        </div>)}
                        {match.isFancy && (
                          <div
                            style={{
                              width: "20px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src="https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/img/icons/ic_fancy.png"
                              className="fancy-icon"
                              alt="Fancy"
                            />
                          </div>
                        )}

                        {match.isBookMaker && (
                          <div
                            style={{
                              width: "20px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src="https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/img/icons/ic_bm.png"
                              className="bookmaker-icon"
                              alt="Bookmaker"
                            />
                          </div>
                        )}
                        {match.isT10 && (
                          <div
                            style={{
                              width: "20px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src="imgs/game-icon.svg"
                              className="bookmaker-icon"
                              style={{ height: "16px" }}
                              alt="T10"
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      className="text-center"
                      style={{ fontSize: "14px", padding: "0px" }}
                    >
                      <b>1</b>
                    </th>
                    <th
                      colSpan={2}
                      className="text-center"
                      style={{ fontSize: "14px", padding: "0px" }}
                    >
                      <b>X</b>
                    </th>
                    <th
                      colSpan={2}
                      className="text-center"
                      style={{ fontSize: "14px", padding: "0px" }}
                    >
                      <b>2</b>
                    </th>
                  </tr>

                  <tr
                    className="memooddsmob"
                    style={{ borderBottom: "1px solid #c7c8ca" }}
                  >
                    {props.memoOdds(runners)}
                  </tr>
                  {/* <tr className="border-bottom">
              <td colSpan={6}>&nbsp;</td>
            </tr> */}
                </Fragment>
              );
            })
          ) : (
            <tr>
              <td className="text-center bg-gray p10">No Match Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(MatchListMobile);
