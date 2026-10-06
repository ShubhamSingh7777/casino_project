import React from "react";
import { isMobile } from "react-device-detect";

import { useNavigate } from "react-router-dom";
interface CustomCasinoListItemProps {
  category: string;
}

interface CustomGame {
  image: string;
}

const CustomCasinoListItem = ({
  category,
}: CustomCasinoListItemProps) => {
  // ==========================================
  // CUSTOM CATEGORIES + CUSTOM IMAGES
  // ==========================================
  const navigate = useNavigate();
  const customCategoryGames: Record<string, CustomGame[]> = {
    all: [
      {
        image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen20v1_green.gif",
      },
    ],

    "teen-patti": [
      {
        image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen20v1_green.gif",
      },
    ],
  };

  // ==========================================
  // GET SELECTED CATEGORY
  // ==========================================

  const selectedGames =
    customCategoryGames[category] || [];

  // ==========================================
  // DISPLAY CUSTOM IMAGES
  // ==========================================

  return (
    <>
      {selectedGames.map((game, index) => (
        <div
          className="casino-list-item"
          key={index}
          onClick={() => navigate("/maintenance")}
          style={{width:isMobile ?'calc(100% - 2px)':''}}
        >
          <img
            src={game.image}
            alt="Casino Game"
            className="casino-list-item-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/imgs/common.jpg";
            }}
            style={{width: '100%'}}
          />
        </div>
      ))}
    </>
  );
};

export default React.memo(CustomCasinoListItem);