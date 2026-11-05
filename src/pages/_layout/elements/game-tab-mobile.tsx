import React from "react";
import { CustomLink } from "./custom-link";
import ISport from "../../../models/ISport";
import { useLocation, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
const GameTabMobile = (props: any) => {
  const location = useLocation();
  const [filter, setFilter] = React.useState("in-play");
  const navigate = useNavigate();
  React.useEffect(() => {
   if (
       (location.pathname === "/" || !props.sportId) &&
       props.sportListState?.sports?.length > 0
      ) {
       const firstSport = props.sportListState.sports[0];
       navigate(`/match/${firstSport.sportId}`, {
          replace: true,
        });
      }
  }, [location.pathname, props.sportId, props.sportListState.sports]);

  // 🖼️ Map sport names to your local image files
  const sportImages: Record<string, string> = {
    Cricket: "/imgs/smallicons/10.png",
    Football: "/imgs/1.png",
    Tennis: "/imgs/smallicons/2.png",
    Volleyball: "imgs/smallicons/15.png",
    Basketball: "/imgs/smallicons/11.png",
    Baseball: "/imgs/baseball.png",
    Futsal: "imgs/smallicons/21.png",
    "Horse Racing": "/imgs/smallicons/9.png",
    "Greyhound Racing": "/imgs/smallicons/20.png",
    Golf: "/imgs/Golf.png",
    "Table Tennis": "/imgs/smallicons/3.png",
    Kabaddi: "imgs/kabaddi.png",
    Esoccer: "imgs/smallicons/4.png",
    Boxing: "imgs/smallicons/5.png",
    "Mixed Martial Arts": "imgs/smallicons/5.png",
    "American Football": "imgs/smallicons/6.png",
    Badminton: "imgs/smallicons/16.png",
    Snooker: "imgs/smallicons/17.png",
    "Ice Hockey": "imgs/smallicons/8.png",
    "E Games": "imgs/smallicons/7.png",
    Politics: "imgs/smallicons/19.png",
    "Motor Sports": "imgs/smallicons/13.png",
    // Add more as needed
  };
  const SPORT_SEQUENCE: number[] = [4, 1, 2, 8, 68, 10, 65, 15, 18,22,59,57,6,3,58,11,19,9,40,52,66];
  
  const orderedSports: ISport[] = React.useMemo(() => {
    const sports = props?.sportListState?.sports ?? [];
  
    return [...sports].sort((a: ISport, b: ISport) => {
      const aIndex = SPORT_SEQUENCE.indexOf(Number(a.sportId));
      const bIndex = SPORT_SEQUENCE.indexOf(Number(b.sportId));
  
      return (
        (aIndex === -1 ? 999 : aIndex) -
        (bIndex === -1 ? 999 : bIndex)
      );
    });
  }, [props?.sportListState?.sports]);
  

  return (
    <div
      className={"mobile-header mobile-header-2"}>
      <ul role="tablist" className="nav nav-tabs nav-justified w-100">
        {orderedSports.map((sport: ISport, index: number) => {
          const isActive = props.sportId
            ? props.sportId == sport.sportId
            : index === 0; // 👈 first item active by default
          const ttpecass =
            sport.sportId == 7 || sport.sportId == 4339
              ? "new-launch-text"
              : "";
          const imageSrc = sportImages[sport.name] || "/imgs/1.png"; 
          return (
            <li key={sport._id} className="nav-item">
              <CustomLink
                to={`/match/${sport.sportId}`}
                className={`nav-link ${isActive ? "active" : ""} ${ttpecass}`}
              >
                <img
                  src={imageSrc}
                  alt={sport.name}
                  height={isMobile ? "19" : "15"}
                  width={isMobile ? "19" : "15"}
                />
                <p>{sport.name}</p>
              </CustomLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default React.memo(GameTabMobile);