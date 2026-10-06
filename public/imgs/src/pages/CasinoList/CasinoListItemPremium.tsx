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

const CasinoListItemPremium = ({
  category,
  games,
}: CustomCasinoListItemProps) => {
  const navigate = useNavigate();

  const customCategoryGames: Record<string, CustomGame[]> = {
    all: [
      {
        title: "premium teenpatti 1-day",
        image: "/imgs/teenpattipremium/teenpatti1Day.jpg",
      },
      {
        title: "Premium 20-20 Teenpatti",
        image: "/imgs/teenpattipremium/pteen20.jpg",
      },
      {
        title: "Premium Baccarat",
        image: "/imgs/teenpattipremium/pbaccarat.jpg",
      },
      {
        title: "Premium 20-20 Dragon Tiger",
        image: "/imgs/teenpattipremium/pdt20.jpg",
      },
      {
        title: "Premium 1 Day Dragon Tiger",
        image: "/imgs/teenpattipremium/pdt6.jpg",
      },
      {
        title: "Premium 32 Cards",
        image: "/imgs/teenpattipremium/pcard32.jpg",
      },
      {
        title: "Premium Lucky 7",
        image: "/imgs/teenpattipremium/plucky7.jpg",
      },
    ],

    "teen-patti": [
      {
        title: "premium teenpatti 1-day",
        image: "/imgs/teenpattipremium/teenpatti1Day.jpg",
      },
      {
        title: "Premium 20-20 Teenpatti",
        image: "/imgs/teenpattipremium/pteen20.jpg",
      },
    ],

    baccarat: [
      {
        title: "Premium Baccarat",
        image: "/imgs/teenpattipremium/pbaccarat.jpg",
      },
    ],

    "dragon tiger": [
      {
        title: "Premium 20-20 Dragon Tiger",
        image: "/imgs/teenpattipremium/pdt20.jpg",
      },
      {
        title: "Premium 1 Day Dragon Tiger",
        image: "/imgs/teenpattipremium/pdt6.jpg",
      },
    ],

    "lucky 7": [
      {
        title: "Premium Lucky 7",
        image: "/imgs/teenpattipremium/plucky7.jpg",
      },
    ],

    "32 Cards": [
      {
        title: "Premium 32 Cards",
        image: "/imgs/teenpattipremium/pcard32.jpg",
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
              e.currentTarget.src = "/imgs/common.jpg";
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

export default React.memo(CasinoListItemPremium);