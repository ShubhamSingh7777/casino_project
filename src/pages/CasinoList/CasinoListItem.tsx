import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { selectCasinoMatchList } from "../../redux/actions/casino/casinoSlice";
import { useAppSelector } from "../../redux/hooks";
import ICasinoMatch from "../../models/ICasinoMatch";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { toast } from "react-toastify";
import { DEFAULT_CASINO_IMAGE, getCasinoImageOverride, sortCasinoGames } from "../../utils/casino-images";

const LazyCasinoItem = ({
  Item,
  onCasinoClick,
}: {
  Item: ICasinoMatch;
  onCasinoClick: (e: MouseEvent<HTMLAnchorElement>, item: ICasinoMatch) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false); // Reset when image changes
  }, [Item.image]);

  useEffect(() => {
    if (!ref.current || loaded) return;

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded) {
            if (ref.current) {
              const override = getCasinoImageOverride(Item);
              if (override) {
                ref.current.style.backgroundImage = `url(${override})`;
              } else {
  const imageUrl = `${Item.image}${Item.slug}.jpg`;

  // Show default image immediately while actual image is loading
  ref.current.style.backgroundImage = `url('${DEFAULT_CASINO_IMAGE}')`;

  const img = new Image();

  img.onload = () => {
    if (ref.current) {
      ref.current.style.backgroundImage = `url('${imageUrl}')`;
      setLoaded(true);
    }
  };

  img.onerror = () => {
    if (ref.current) {
      // Keep default image if actual image fails
      ref.current.style.backgroundImage = `url('${DEFAULT_CASINO_IMAGE}')`;
      setLoaded(true);
    }
  };

  img.src = imageUrl;

  observerInstance.unobserve(entry.target);
  return;
}
              setLoaded(true);
              observerInstance.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [Item.image, loaded]);

  return (
    <div className="casino-list-item">
      <a href="#" onClick={(e) => onCasinoClick(e, Item)} className="">
        <div
          className="casino-list-item-banner"
          ref={ref}
          style={{
            backgroundColor: "#ccc",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 0.4s ease-in-out",
          }}
        ></div>
        <div className="casino-list-name">{Item.title}</div>
      </a>
    </div>
  );
};

const CasinoListItem = () => {
  const gamesList = useAppSelector<any>(selectCasinoMatchList);
  console.log("CASINO GAMES LIST:", gamesList);
  const navigate = useNavigateCustom();

const orderedGames = sortCasinoGames(gamesList || []);
  const onCasinoClick = (
    e: MouseEvent<HTMLAnchorElement>,
    Item: ICasinoMatch,
  ) => {
    e.preventDefault();
    if (!Item.isDisable && Item.match_id !== -1) {
      navigate.go(`/casino/${Item.slug}/${Item.match_id}`);
    } else {
      toast.warn("This game is suspended by admin, please try again later");
    }
  };

  return (
    <>
      {/* <div className="casino-list-item">
        <div
          className="casino-list-item-banner"
          style={{
            backgroundImage: "url('/imgs/goal2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="casino-list-name">Goal 2</div>
      </div> */}
     {orderedGames.map((Item: ICasinoMatch, key: number) => (
  <React.Fragment key={Item.match_id || key}>
    <LazyCasinoItem
      Item={Item}
      onCasinoClick={onCasinoClick}
    />

    {Item.title === "Mogambo" && (
      <div className="casino-list-item">
        <a
          href="/casino-in/our-vip"
          onClick={(e) => {
            e.preventDefault();
            navigate.go("/casino-in/our-vip");
          }}
        >
          <div
            className="casino-list-item-banner"
            style={{
              backgroundImage: "url('/imgs/teen20v1_green.gif')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="casino-list-name">20-20 Teenpatti VIP1</div>
        </a>
      </div>
    )}
  </React.Fragment>
))}
    </>
  );
};

export default React.memo(CasinoListItem);