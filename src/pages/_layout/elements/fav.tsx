import { AxiosResponse } from "axios";
import React from "react";
import sportsService from "../../../services/sports.service";
import IMatch from "../../../models/IMatch";
import { isMobile } from "react-device-detect";
import { CustomLink } from "./custom-link";

const Fav = (props: any) => {
  const [matchList, setMatchList] = React.useState<any[]>([]);
  React.useEffect(() => {
    sportsService
      .getHighlight()
      .then((res: AxiosResponse<any>) => {
        setMatchList(res.data?.data?.data?.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const sportImagesById: Record<number, string> = {
    4: "/imgs/smallicons/10.png", //cricekt
    1: "/imgs/smallicons/1.png", //football
    2: "/imgs/smallicons/2.png", //tennis
    9: "/imgs/smallicons/21.png", //Futsal
    68: "/imgs/smallicons/4.png", //esoccer
    10: "/imgs/smallicons/9.png", //"Horse Racing"
    65: "/imgs/smallicons/20.png", //"Greyhound Racing"
    8: "/imgs/smallicons/3.png", //"Table Tennis"
    15: "/imgs/smallicons/11.png", //Basketball
    6: "/imgs/smallicons/5.png", //Boxing
    3: "/imgs/smallicons/5.png", //"Mixed Martial Arts"
    58: "/imgs/smallicons/6.png", //"American Football"
    18: "/imgs/smallicons/15.png", //Volleyball
    22: "/imgs/smallicons/16.png", //"Badminton"
    64: "/imgs/smallicons/7.png", //"Esports"
    63: "/imgs/smallicons/9.png", //""Special Bets""
    62: "/imgs/smallicons/17.png", //"Soccer"
    61: "/imgs/smallicons/9.png", //""Lottery Specials"
    60: "/imgs/smallicons/9.png", //""Gaelic Games""
    56: "/imgs/smallicons/9.png", //"Curling"
    57: "/imgs/smallicons/18.png", //"Darts"
    59: "/imgs/smallicons/17.png", //"Snooker"
    19: "/imgs/smallicons/8.png", //""Ice Hockey""
    11: "/imgs/smallicons/7.png", //""E Games""
    40: "/imgs/smallicons/19.png", //"Politics"
    39: "/imgs/smallicons/9.png", //"Handball"
    52: "/imgs/smallicons/13.png", //""Motor Sports""
    12: "/imgs/smallicons/20.png", //"Greyhounds"
    5: "/imgs/Golf.png", //"Golf"
    55: "/imgs/smallicons/9.png", //""Rugby League""
    7: "/imgs/smallicons/15.png", //""Beach Volleyball""
    13: "/imgs/smallicons/9.png", //"Trotting"
    14: "/imgs/smallicons/", //Speedway
  };
  const getSportImage = (sportId: string | number) => {
    const id = Number(sportId);
    return sportImagesById[id] || "/imgs/smallicons/10.png";
  };

  return (
    <div className="favourite">
      <ul>
        {matchList.map((match: any) => {
          const matchId = match.id || match.matchId;
          return (
            <li key={matchId}>
              <CustomLink to={`/odds/${matchId}`} className="new-launch-text">
                <span className="lable-fav">
                  <img
                    src={getSportImage(match.sportId)}
                    alt="sport"
                    className="fav-sport-img"
                    onError={(e) => (e.currentTarget.src = "/imgs/default.png")}
                    style={{
                      width: isMobile ? "18px" : "20px",
                      height: isMobile ? "18px" : "20px",
                      marginRight: isMobile ? "4px" : "5px",
                    }}
                  />{" "}
                  <p>{match.name}</p>
                </span>
              </CustomLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Fav;
