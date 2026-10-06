import React from "react";
import LMatch from "../../../models/LMatch";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import { selectCasinoMatchList } from "../../../redux/actions/casino/casinoSlice";

interface MatchListProps {
  matchList: LMatch[];
  currentMatch: (match: LMatch) => void;
  memoOdds: (runners: any) => React.ReactNode;
}

const HORSE_RACING_ID = 10;

const MatchList: React.FC<MatchListProps> = ({
  matchList,
  currentMatch,
  memoOdds,
}) => {
  const { sportId } = useParams<{ sportId: string }>();
  const [selectedSeries, setSelectedSeries] = React.useState<string | null>(
    null,
  );

  const activeSportId = sportId ? Number(sportId) : matchList[0]?.sportId;
  const location = useLocation();
  const navigate = useNavigate();
  const isMatch4 = location.pathname.includes("match/4");
  const isHorseRacing = activeSportId === HORSE_RACING_ID;
  const casinoList = useAppSelector<any>(selectCasinoMatchList);
  const superOver2 = React.useMemo(() => {
    return casinoList?.filter((item: any) => item.slug === "superover2") || [];
  }, [casinoList]);
  const isLoggedIn = !!localStorage.getItem("token");

  const handleMatchClick = (match: LMatch) => {
    if (!isLoggedIn) {
      toast.error("Please login first", { duration: 2500 });
      return;
    }
    currentMatch(match);
  };

  /** Filter by sport */
const filteredMatches = React.useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return matchList.filter((m) => {
    if (m.sportId !== activeSportId) return false;

    const matchDate = new Date(m.matchDateTime);
    matchDate.setHours(0, 0, 0, 0);

    // Show yesterday, today and all upcoming matches
    return matchDate >= yesterday;
  });
}, [matchList, activeSportId]);

  /** Horse racing → series grouping */
  const seriesMap = React.useMemo(() => {
    if (!isHorseRacing) return {};
    return filteredMatches.reduce((acc: any, match: any) => {
      const series = match.series || "Others";
      if (!acc[series]) acc[series] = [];
      acc[series].push(match);
      return acc;
    }, {});
  }, [isHorseRacing, filteredMatches]);

  /** Auto-select first series */
  React.useEffect(() => {
    if (isHorseRacing && !selectedSeries) {
      const firstSeries = Object.keys(seriesMap)[0];
      if (firstSeries) setSelectedSeries(firstSeries);
    }
  }, [isHorseRacing, seriesMap, selectedSeries]);

  /** Apply series filter */
  const seriesFilteredMatches = React.useMemo(() => {
    if (!isHorseRacing) return filteredMatches;
    return selectedSeries ? seriesMap[selectedSeries] || [] : [];
  }, [isHorseRacing, selectedSeries, seriesMap, filteredMatches]);

  /** Group horse racing by venue name */
  const horseRacingGroupedByName = React.useMemo(() => {
    if (!isHorseRacing) return {};
    return seriesFilteredMatches.reduce((acc: any, match: any) => {
      if (!acc[match.name]) acc[match.name] = [];
      acc[match.name].push(match);
      return acc;
    }, {});
  }, [isHorseRacing, seriesFilteredMatches]);
  const getSuperOverRunners = (item: any) => {
    return item?.markets?.find(
      (m: any) => m.marketName === "MATCH_ODDS" || m.marketName === "SUPEROVER",
    )?.runners;
  };
  return (
    <div className="card-content">
      {/* SERIES TABS (OUTSIDE TABLE) */}
      {isHorseRacing && (
        <div style={{ display: "flex", overflowX: "auto" }}>
          {Object.keys(seriesMap).map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              style={{
                padding: "8px 14px",
                border: "none",
                background: selectedSeries === series ? "#2C3E50" : "#ccc",
                color: selectedSeries === series ? "#fff" : "#000",
                fontWeight: 500,
                borderLeft: "1px solid #2C3E50",
              }}
            >
              {series}
            </button>
          ))}
        </div>
      )}

      <table
        className="table coupon-table"
        style={{ background: isHorseRacing ? "#f7f7f7" : "" }}
      >
        {!isHorseRacing && (
          <thead>
            <tr>
              <th style={{ width: "64%" }}>Game</th>
              <th colSpan={2}>1</th>
              <th colSpan={2}>X</th>
              <th colSpan={2}>2</th>
            </tr>
          </thead>
        )}

        <tbody>
          {isMatch4 &&
            superOver2.length > 0 &&
            superOver2.map((Item: any) => {
              const runners = getSuperOverRunners(Item);

              return (
                <tr key={Item.match_id}>
                  <td>
                    <div className="game-name">
                      <a
                        onClick={(e) => {
                          e.preventDefault();

                          const isLoggedIn = !!localStorage.getItem("token");
                          if (!isLoggedIn) {
                            toast.error("Please login first");
                            return;
                          }

                          // same casino navigation
                          navigate(`/casino/${Item.slug}/${Item.match_id}`);
                        }}
                        className="text-dark"
                      >
                        {Item.title || "Super Over 2"}
                      </a>
                    </div>
                     
                    <div className="game-icons">
                      <span className="active" />
                      <img
                        src="/tv-icon.png"
                        alt="icon-tv"
                        className="icon-tv"
                      />
                    </div>
                  </td>

                  {/* 🔥 SAME ODDS UI */}
                  {memoOdds(runners)}
                </tr>
              );
            })}
          {isHorseRacing ? (
            Object.keys(horseRacingGroupedByName).length > 0 ? (
              Object.entries(horseRacingGroupedByName).map(
                ([name, races]: any) => (
                  <React.Fragment key={name}>
                    {/* VENUE NAME */}
                    <tr
                      style={{
                        borderBottom: "1px solid #c7c8ca",
                        padding: "6px 8px 1px 8px",
                      }}
                    >
                      <td
                        colSpan={7}
                        style={{ borderTop: "unset", verticalAlign: "middle" }}
                      >
                        <div
                          className="game-name fw-400"
                          style={{ marginLeft: "14px" }}
                        >
                          <i className="fas fa-tv icon-tv" />{" "}
                          <span style={{ color: "#333", marginLeft: "6px" }}>
                            {name}
                          </span>
                        </div>
                      </td>
                      <td colSpan={7} style={{ borderTop: "unset" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                            padding: "5px 0px",
                          }}
                        >
                          {races.map((race: LMatch) => (
                            <span
                              key={race.matchId}
                              onClick={() => handleMatchClick(race)}
                              style={{
                                padding: "6px 12px",
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                cursor: "pointer",
                                background: "#cccccc",
                              }}
                            >
                              {moment.utc(race.matchDateTime).format("HH:mm")}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>

                    {/* TIMES */}
                    <tr></tr>
                  </React.Fragment>
                ),
              )
            ) : (
              <tr>
                <td colSpan={7} className="text-center p10">
                  No Match Found
                </td>
              </tr>
            )
          ) : (
            filteredMatches.map((match) => {
              const localTime = new Date(match.matchDateTime.replace("Z", ""));

              return (
                <tr key={match.matchId}>
                  <td>
                    <div className="game-name">
                      <a
                        onClick={() => handleMatchClick(match)}
                        className="text-dark"
                      >
                        {match.name} /{" "}
                        {moment
                          .utc(match.matchDateTime)
                          .format("DD-MM-YYYY HH:mm")}
                      </a>
                    </div>

                    <div className="game-icons">
                      {localTime.getTime() < Date.now() && (
                        <span className="active" />
                      )}
                      {/* <i className="fas fa-tv icon-tv" /> */}
                    {match.inPlay && (
                      <div style={{width:'35px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                      <img
                        src="/tv-icon.png"
                        alt="icon-tv"
                        className="icon-tv" style={{width: "15px", height: "15px"}}
                      />
                      </div>)}
                         {match.isFancy && (
                          <div style={{width:'35px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <img
                          src='https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/img/icons/ic_fancy.png'
                          className='fancy-icon'
                          alt='Fancy'
                        />
                        </div>
                      )}

                      {match.isBookMaker && (
                         <div style={{width:'35px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <img
                          src='https://dzm0kbaskt4pv.cloudfront.net/v2/static/front/img/icons/ic_bm.png'
                          className='bookmaker-icon'
                          alt='Bookmaker'
                        />
                        </div>
                      )}
                        {match.isT10 && (
                          <div style={{width:'35px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <img
                          src='imgs/game-icon.svg'
                          className='bookmaker-icon'
                          style={{ height: '16px' }}
                          alt='T10'
                        />
                        </div>
                      )}  
                    </div>
                  </td>

                  {memoOdds(
                    match?.markets?.find((m) => m.marketName === "MATCH_ODDS")
                      ?.runners,
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchList;
