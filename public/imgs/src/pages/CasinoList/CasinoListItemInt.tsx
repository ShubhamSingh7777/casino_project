import React, { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';

const CasinoListItemInt = (props: any) => {
  //  useEffect(() => {
  //   console.log("🎮 Games Data:", props.games);
  // }, [props.games]);

  return (
    <>
      {props.games &&
        props.games
          .filter((Item: any) => Item.game_image1 && Item.game_image1.trim())
          .map((Item: any) => (
            <LazyCasinoItem
              key={Item.game_name + Item.identifier} // Use stable key
              Item={Item}
              setGamePlay={props.setGamePlay}
              gamePlay={props.gamePlay}
            />
          ))}
    </>
  );
};

const LazyCasinoItem = ({ Item, setGamePlay, gamePlay }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  // useEffect(() => {
  //   setLoaded(false); // Reset when image changes
  // }, [Item.game_image]);

  // useEffect(() => {
  //   if (!ref.current || loaded) return;

  //   const observer = new IntersectionObserver(
  //     (entries, observerInstance) => {
  //       entries.forEach(entry => {
  //         if (entry.isIntersecting && !loaded) {
  //           if (ref.current) {
  //             ref.current.style.backgroundImage = `url('https://igamingapis.com/img/${Item.identifier}.png')`;
  //             setLoaded(true);
  //             observerInstance.unobserve(entry.target);
  //           }
  //         }
  //       });
  //     },
  //     {
  //       rootMargin: '0px',
  //       threshold: 0.1,
  //     }
  //   );

  //   observer.observe(ref.current);

  //   return () => {
  //     if (ref.current) {
  //       observer.unobserve(ref.current);
  //     }
  //   };
  // }, [Item.game_image, loaded]);
  useEffect(() => {
    if (!ref.current || loaded) return;

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loaded) {
            const imageUrl =
              Item.game_image1?.trim()
                ? Item.game_image1
                : "";

            setImageSrc(imageUrl);
            setLoaded(true);
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [Item.game_image1, Item.identifier, loaded]);
  return (
    <div
      className="casino-list-item"
      onClick={(e) => {
        e.preventDefault();
        if (gamePlay) {
          return;
        }
        setGamePlay(Item);
      }}
      style={{
        width: isMobile ? 'calc(25% - 10px)' : 'calc(14% - 1.8px)',
      }}
    >
      <a href="#" className="">
        <div
          className="casino-list-item-banner"
          ref={ref}
          style={{
            aspectRatio: isMobile ? "12/8" : "12/8",
            overflow: "hidden",
            backgroundColor: "#ccc",
            paddingTop: isMobile ? 'unset' : 'unset',
            
          }}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={Item.game_name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = `https://igamingapis.com/img/${Item.identifier}.png`;
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // change to "contain" if you want the full image
                display: "unset",
              }}
            />
          )}
        </div>
        {/* <div className="casino-title-providers">{Item.game_name || Item.name || 'Untitled Game'}</div> */}
      </a>
    </div>
  );
};

export default React.memo(CasinoListItemInt);