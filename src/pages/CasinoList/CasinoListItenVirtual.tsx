import React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import ICasinoMatch from "../../models/ICasinoMatch";

interface CustomCasinoListItemProps {
  category: string;
  games: ICasinoMatch[];
}

interface CustomGame {
  image: string;
  title: string;
}

const CasinoListItemVirtual = ({
  category,
  games,
}: CustomCasinoListItemProps) => {
  const navigate = useNavigate();

  const customCategoryGames: Record<string, CustomGame[]> = {
    all: [
      {
        title: "V-Lucky 7 - A",
        image: "/imgs/virtual/vlucky7.jpg",
      },
      {
        title: "V-Trio",
        image: "/imgs/virtual/vtrio.jpg",
      },
      {
        title: "V-20-20 D T L",
        image: "/imgs/virtual/vdtl20.jpg",
      },
      {
        title: "V-Muflis Teenpatti",
        image: "/imgs/virtual/vteenmuf.jpg",
      },
      {
        title: "V-Amar Akbar Anthony",
        image: "/imgs/virtual/vaaa.jpg",
      },
         {
        title: "V-Bollywood Casino",
        image: "/imgs/virtual/vbtable.jpg",
      },
      {
        title: "V-1 Day Dragon Tiger",
        image: "/imgs/virtual/vdt6.jpg",
      },
      {
        title: "V-Teenpatti 1-day",
        image: "/imgs/virtual/vteen.jpg",
      },
      {
        title: "V-20-20 Teenpatti",
        image: "/imgs/virtual/vteen20.jpg",
      },
    
    ],

    "teen-patti": [
         {
        title: "V-Muflis Teenpatti",
        image: "/imgs/virtual/vteenmuf.jpg",
      },
        {
        title: "V-Teenpatti 1-day",
        image: "/imgs/virtual/vteen.jpg",
      },
      {
        title: "V-20-20 Teenpatti",
        image: "/imgs/virtual/vteen20.jpg",
      },
    ],

    "dragon tiger": [
    {
        title: "V-20-20 D T L",
        image: "/imgs/virtual/vdtl20.jpg",
      },
      {
        title: "V-1 Day Dragon Tiger",
        image: "/imgs/virtual/vdt6.jpg",
      },
    ],

    "lucky 7": [
       {
        title: "V-Lucky 7 - A",
        image: "/imgs/virtual/vlucky7.jpg",
      },
    ],

    "bollywood": [
        {
        title: "V-Amar Akbar Anthony",
        image: "/imgs/virtual/vaaa.jpg",
      },
         {
        title: "V-Bollywood Casino",
        image: "/imgs/virtual/vbtable.jpg",
      },
    ],
    "others": [
        {
        title: "V-Trio",
        image: "/imgs/virtual/vtrio.jpg",
      },
    ],
  };

  const selectedGames = customCategoryGames[category] || [];

  const handleGameClick = (game: CustomGame) => {
    // Find the same game from Premium API
    const apiGame = games.find(
      (item) =>
        item.title?.toLowerCase() === game.title.toLowerCase()
    );

    console.log("Clicked Premium Game:", game);
    console.log("Matching API Game:", apiGame);

    if (!apiGame) {
      console.log("Game not found in Premium API:", game.title);
      return;
    }

    if (apiGame.isDisable || apiGame.match_id === -1) {
      return;
    }

    navigate(`/casino/${apiGame.slug}/${apiGame.match_id}`);
  };

  return (
    <>
      {selectedGames.map((game, index) => (
        <div
          className="casino-list-item"
          key={index}
          onClick={() => handleGameClick(game)}
          style={{
            width: isMobile ? "calc(100% - 2px)" : "",
          }}
        >
          <img
            src={game.image}
            alt={game.title}
            className="casino-list-item-img"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/imgs/virtual/default.jpg";
            }}
            style={{
              width: "100%",
            }}
          />
        </div>
      ))}
    </>
  );
};

export default React.memo(CasinoListItemVirtual);