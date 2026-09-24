import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { selectCasinoMatchList } from "../../redux/actions/casino/casinoSlice";
import { useAppSelector } from "../../redux/hooks";
import ICasinoMatch from "../../models/ICasinoMatch";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import { toast } from "react-toastify";

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
              if (Item.slug == "mogambo") {
                ref.current.style.backgroundImage =
                  "url(https://nd.sprintstaticdata.com/casino-icons/lc/mogambo.gif)";
              } else if (Item.slug == "dolidana") {
                ref.current.style.backgroundImage =
                  "url(https://nd.sprintstaticdata.com/casino-icons/lc/dolidana.gif)";
              } else if (Item.slug == "worli3") {
                ref.current.style.backgroundImage =
                  "url(https://nd.sprintstaticdata.com/casino-icons/lc/worli3.gif)";
              } else if (Item.slug == "teen62") {
                ref.current.style.backgroundImage =
                  "url(https://nd.sprintstaticdata.com/casino-icons/lc/teen62.gif)";
              } else if (Item.title == "3 Cards Judgement") {
                ref.current.style.backgroundImage = "url(/imgs/3cardj.jpg)";
              } else if (Item.title == "32 Cards A") {
                ref.current.style.backgroundImage = "url(/imgs/32cardA.jpg)";
              } else if (Item.title == "32 Cards B") {
                ref.current.style.backgroundImage = "url(/imgs/32cardB.jpg)";
              } else if (Item.title == "Amar Akbar Anthony") {
                ref.current.style.backgroundImage =
                  "url(/imgs/amarakbaranthony.jpg)";
              } else if (Item.title == "Andar Bahar") {
                ref.current.style.backgroundImage = "url(/imgs/andarbahar.jpg)";
              } else if (Item.title == "Andar Bahar 2") {
                ref.current.style.backgroundImage =
                  "url(/imgs/andarbahar2A.jpg)";
              } else if (Item.title == "Baccarat 2") {
                ref.current.style.backgroundImage = "url(/imgs/bacarrat2.jpg)";
              }else if (Item.title == "Baccarat") {
                ref.current.style.backgroundImage = "url(/imgs/baccarat.jpg)";
              } else if (Item.title == "29Card Baccarat") {
                ref.current.style.backgroundImage = "url(/imgs/bacarrat29.jpg)";
              } else if (Item.title == "Ball by Ball") {
                ref.current.style.backgroundImage = "url(/imgs/ballbyball.jpg)";
              } else if (Item.title == "Beach Roulette") {
                ref.current.style.backgroundImage =
                  "url(/imgs/beachRoulette.jpg)";
              } else if (Item.title == "Bollywood Table") {
                ref.current.style.backgroundImage = "url(/imgs/btable.jpg)";
              } else if (Item.title == "Casino Meter") {
                ref.current.style.backgroundImage =
                  "url(/imgs/casinometetr.jpg)";
              } else if (Item.title == "Casino Queen") {
                ref.current.style.backgroundImage =
                  "url(/imgs/casinoqueen.jpg)";
              } else if (Item.title == "Casino War") {
                ref.current.style.backgroundImage = "url(/imgs/casinowar.jpg)";
              } else if (Item.title == "20-20 Cricket Match") {
                ref.current.style.backgroundImage = "url(/imgs/cmatch20.jpg)";
              } else if (Item.title == "Casino Meter") {
                ref.current.style.backgroundImage = "url(/imgs/cmeter1.jpg)";
              } else if (Item.title == "1 Day Dragon Tiger") {
                ref.current.style.backgroundImage =
                  "url(/imgs/daragontiger1day.jpg)";
              } else if (Item.title == "20-20 Dragon Tiger") {
                ref.current.style.backgroundImage =
                  "url(/imgs/dragontiger2020.jpg)";
              } else if (Item.title == "20-20 Dragon Tiger 2") {
                ref.current.style.backgroundImage = "url(/imgs/dt202.jpg)";
              } else if (Item.title == "20-20 DTL") {
                ref.current.style.backgroundImage = "url(/imgs/dtl20.jpg)";
              } else if (Item.title == "Dus ka Dum") {
                ref.current.style.backgroundImage = "url(/imgs/dum10.jpg)";
              } else if (Item.title == "Golden Roulette") {
                ref.current.style.backgroundImage =
                  "url(/imgs/goldenroulette.jpg)";
              } else if (Item.title == "Instant Teenpatti") {
                ref.current.style.backgroundImage =
                  "url(/imgs/instantteenpatti.jpg)";
              } else if (Item.title == "Instant Worli") {
                ref.current.style.backgroundImage = "url(/imgs/instantworli.jpg)";
              } else if (Item.title == "Jack Top Open Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/jacktopopen.jpg)";
              } else if (Item.title == "Lottery") {
                ref.current.style.backgroundImage = "url(/imgs/lottery.jpg)";
              }
              else if (Item.title == "Lucky 7 - B") {
                ref.current.style.backgroundImage = "url(/imgs/luck7B.jpg)";
              }
              else if (Item.title == "Lucky 7 - A") {
                ref.current.style.backgroundImage = "url(/imgs/lucky7A.jpg)";
              }
              else if (Item.title == "Lucky 7 - C") {
                ref.current.style.backgroundImage = "url(/imgs/lucky7eu2.jpg)";
              }
              else if (Item.title == "Lucky 15") {
                ref.current.style.backgroundImage = "url(/imgs/lucky15.jpg)";
              }
              else if (Item.title == "Note Number") {
                ref.current.style.backgroundImage = "url(/imgs/notenum.jpg)";
              }
              else if (Item.title == "1 CARD ONE-DAY") {
                ref.current.style.backgroundImage = "url(/imgs/onecard1day.jpg)";
              }
              else if (Item.title == "1 Card 20-20") {
                ref.current.style.backgroundImage = "url(/imgs/onecard2020.jpg)";
              }
              else if (Item.title == "Amar Akbar Anthony 2.0") {
                ref.current.style.backgroundImage = "url(/imgs/aaa2.jpg)";
              } else if (Item.title == "1 Card Meter") {
                ref.current.style.backgroundImage = "url(/imgs/cardmeter1.jpg)";
              }else if (Item.title == "1 Day Poker") {
                ref.current.style.backgroundImage = "url(/imgs/poker1day.jpg)";
              }else if (Item.title == "6 Player Poker") {
                ref.current.style.backgroundImage = "url(/imgs/poker6players.jpg)";
              }else if (Item.title == "20-20 Poker") {
                ref.current.style.backgroundImage = "url(/imgs/poker2020.jpg)";
              }else if (Item.title == "Queen Top Open Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/queentopopen.jpg)";
              }
              else if (Item.title == "Race To 17") {
                ref.current.style.backgroundImage = "url(/imgs/race17.jpg)";
              }
              else if (Item.title == "Race 20-20") {
                ref.current.style.backgroundImage = "url(/imgs/race20.jpg)";
              }
              else if (Item.title == "Race to 2nd") {
                ref.current.style.backgroundImage = "url(/imgs/raceto2nd.jpg)";
              }
              else if (Item.title == "Super Over") {
                ref.current.style.backgroundImage = "url(/imgs/superover.jpg)";
              }
              else if (Item.title == "Teenpatti Muflis") {
                ref.current.style.backgroundImage = "url(/imgs/teenmuf.jpg)";
              }else if (Item.title == "Teenpatti - 2.0") {
                ref.current.style.backgroundImage = "url(/imgs/teenpatti2O.jpg)";
              }else if (Item.title == "1 Day Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/teenpattioneday.jpg)";
              }
              else if (Item.title == "Open Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/teenpattiopen.jpg)";
              }else if (Item.title == "20-20 Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/tenpatti2020.jpg)";
              }
              else if (Item.title == "20-20 Teenpatti B") {
                ref.current.style.backgroundImage = "url(/imgs/tenpattiB2020.jpg)";
              }else if (Item.title == "Test Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/textteenpatti.jpg)";
              }else if (Item.title == "The Trap") {
                ref.current.style.backgroundImage = "url(/imgs/trap.jpg)";
              }else if (Item.title == "Trio") {
                ref.current.style.backgroundImage = "url(/imgs/trio.jpg)";
              }else if (Item.title == "2 Cards Teenpatti") {
                ref.current.style.backgroundImage = "url(/imgs/twocardsteenpatti.jpg)";
              }else {   
                ref.current.style.backgroundImage = `url('${
                  Item.image + Item.slug + ".jpg"
                }')`;
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
  const gameOrder = [
    "Goal 2",
    "Matka",
    "V VIP Teenpatti 1-day",
    "Dolidana",
    "Mogambo",
    "Lucky 6",
    "Beach Roulette",
    "Roulette",
    "Golden Roulette",
    "Teenpatti Poison One Day",
    "Unique Teenpatti",
    "Teenpatti Poison 20-20",
    "Unlimited Joker 20-20",
    "Teenpatti Joker 20-20",
    "Unlimited Joker Oneday",
    "20-20 Teenpatti C",
    "Bollywood Table 2",
    "Unique Roulette",
    "Mini Superover",
    "Goal",
    "ANDAR BAHAR 150 cards",
    "Lucky 15",
    "Super Over 2",
    
    "Queen Top Open Teenpatti",
    "Jack Top Open Teenpatti",
    "Sic Bo2",
    "Instant Teenpatti 3.0",
    "Ball by Ball",
    "Instant Teenpatti 2.0",
    "1 Day Teenpatti",
    "20-20 Teenpatti",
    "Test Teenpatti",
    "Open Teenpatti",
    "1 Day Poker",
    "20-20 Poker",
    "6 Player Poker",
    "Baccarat",
    "Baccarat 2",
    "20-20 Dragon Tiger",
    "1 Day Dragon Tiger",
    "20-20 DTL",
    "20-20 Dragon Tiger 2",
    "32 Cards A",
    "32 Cards B",
    "Andar Bahar",
    "Andar Bahar 2",
    "Lucky 7 - A",
    "Lucky 7 - B",
    "3 Cards Judgement",
    "Casino War",
    "Worli Matka",
    "Instant Worli",
    "Amar Akbar Anthony",
    "Bollywood Table",
    "Lottery",
    "5Five Cricket",
    "20-20 Cricket Match",
    "Casino Meter",
    "Teenpatti - 2.0",
    "Casino Queen",
    "Race 20-20",
    "Lucky 7 - C",
    "Super Over",
    "The Trap",
    "2 Cards Teenpatti",
    "29Card Baccarat",
    "Teenpatti Muflis",
    "Race To 17",
    "20-20 Teenpatti B",
    "Trio",
    "Note Number",
    "1 Card 20-20",
    "1 CARD ONE-DAY",
    "ANDAR BAHAR 50 cards",
    "Amar Akbar Anthony 2.0",
    "Race to 2nd",
    "Instant Teenpatti",
    "Dus ka Dum",
    "1 Card Meter",
  ];
  const orderedGames = gamesList
    ? [
        ...gameOrder
          .map((title) =>
            gamesList.find(
              (game: ICasinoMatch) => (game.title ?? "") === title,
            ),
          )
          .filter(Boolean),
        ...gamesList.filter(
          (game: ICasinoMatch) => !gameOrder.includes(game.title ?? ""),
        ),
      ]
    : [];

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
        <LazyCasinoItem
          key={Item.match_id || key}
          Item={Item}
          onCasinoClick={onCasinoClick}
        />
      ))}
    </>
  );
};

export default React.memo(CasinoListItem);