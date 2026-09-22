import { AxiosResponse } from "axios";
import React from "react";
import casinoService from "../../services/casino.service";
import { Link, useParams, useSearchParams } from "react-router-dom";
import CasinoListItemInt from "../CasinoList/CasinoListItemInt";
import authService from "../../services/auth.service";
import { isMobile } from "react-device-detect";
import { Commet } from "react-loading-indicators";

const CasinoOther = () => {
  const queryp = useParams();
  const [searchParams] = useSearchParams();

  const provQuery = searchParams.get("category"); // provider
  const typeQuery = searchParams.get("type"); // category filter

  const [fullData, setFullData] = React.useState<any>([]);
  const [providerList, setProviderList] = React.useState<any>([]);
  const [activeProvider, setActiveProvider] = React.useState<string>("");

  const [categoryList, setCategoryList] = React.useState<any>([]);
  const [activeCategory, setActiveCategory] = React.useState<string>("");

  const [games, setGames] = React.useState<any>([]);
  const [gamePlay, setGamePlay] = React.useState<any>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [launching, setLaunching] = React.useState(false);

  // Detect special categories
  const detectSpecialCategory = (gameName: string) => {
    const name = gameName.toLowerCase();

    if (name.includes("mine")) return "Mines";

    if (
      name.includes("color") ||
      name.includes("colour") ||
      name.includes("chicken") ||
      name.includes("cock")
    ) {
      return "Color & Chicken";
    }

    return null;
  };

  // INITIAL LOAD
  React.useEffect(() => {
    setIsLoading(true);

    casinoService
      .getIntCasinoList(queryp.type)
      .then((res: AxiosResponse<any>) => {
        const list = res.data.result;
        setFullData(list);

        const providers = [
          "ALL",
          ...Array.from(new Set(list.map((p: any) => p._id))),
        ];
        setProviderList(providers);

        // Provider from query
        const defaultProvider = provQuery
          ? decodeURIComponent(provQuery)
          : "ALL";
        setActiveProvider(defaultProvider);

        let allGames: any[] = [];
        let baseCats: string[] = [];
        let specialCats: string[] = [];

        // CASE 1: Provider = ALL
        if (defaultProvider === "ALL") {
          allGames = list.flatMap((p: any) => p.games);

          baseCats = Array.from(new Set(allGames.map((g: any) => g.category)));

          allGames.forEach((g: any) => {
            const s = detectSpecialCategory(g.game_name);
            if (s) specialCats.push(s);
          });

          specialCats = Array.from(new Set(specialCats));

          const finalCats = [...baseCats, ...specialCats];
          setCategoryList(finalCats);

          if (typeQuery) {
            let decodedType = decodeURIComponent(typeQuery);
            if (decodedType == "wingo") {
              decodedType = "Color & Chicken";
            }
            setActiveCategory(decodedType);
            const filteredGames = allGames.filter((g: any) => {
              const special = detectSpecialCategory(g.game_name);
              return special === decodedType || g.category === decodedType;
            });
            setGames(filteredGames);
          } else {
            setActiveCategory("");
            setGames(allGames);
          }
        }

        // CASE 2: Specific provider selected
        else {
          const provider = list.find((p: any) => p._id === defaultProvider);

          if (provider) {
            allGames = provider.games;

            baseCats = Array.from(
              new Set(allGames.map((g: any) => g.category)),
            );
            setCategoryList(baseCats);

            // CASE 2A: type query exists → select category for this provider
            if (typeQuery) {
              const decodedType = decodeURIComponent(typeQuery);
              setActiveCategory(decodedType);

              const filteredGames = allGames.filter(
                (g: any) => g.category === decodedType,
              );
              setGames(filteredGames);
            } else {
              const firstCat = baseCats[0] || "";
              setActiveCategory(firstCat);

              if (firstCat) {
                setGames(allGames.filter((g: any) => g.category === firstCat));
              } else {
                setGames(allGames);
              }
            }
          }
        }

        setIsLoading(false);
      });
  }, [queryp.type]);

  // Provider change
  const onProviderChange = (prov: string) => {
    setActiveProvider(prov);
    setActiveCategory("");

    if (prov === "ALL") {
      const allGames = fullData.flatMap((p: any) => p.games);

      const baseCats = Array.from(
        new Set(allGames.map((g: any) => g.category)),
      );

      let specialCats: string[] = [];
      allGames.forEach((g: any) => {
        const s = detectSpecialCategory(g.game_name);
        if (s) specialCats.push(s);
      });
      specialCats = Array.from(new Set(specialCats));

      setCategoryList([...baseCats, ...specialCats]);
      setGames(allGames);

      return;
    }

    const providerGames =
      fullData.find((p: any) => p._id === prov)?.games || [];

    const cats = Array.from(new Set(providerGames.map((g: any) => g.category)));

    setCategoryList(cats);
    setGames(providerGames);
  };

  // Category change
  const onCategoryChange = (cat: string) => {
    setActiveCategory(cat);

    const allGames =
      activeProvider === "ALL"
        ? fullData.flatMap((p: any) => p.games)
        : fullData.find((p: any) => p._id === activeProvider)?.games || [];

    if (cat === "") {
      setGames(allGames);
      return;
    }

    const filtered = allGames.filter((g: any) => {
      const special = detectSpecialCategory(g.game_name);
      return special === cat || g.category === cat;
    });

    setGames(filtered);
  };

  // Handle Game Launch
  React.useEffect(() => {
    if (!gamePlay || launching) return;

    setLaunching(true);

    const payload = {
      gameCode: gamePlay.identifier,
      lobby_url: gamePlay.identifier,
      ipAddress: authService.getIpAddress(),
      isMobile: isMobile,
    };

    casinoService
      .getplaycasino(payload)
      .then((res) => {
        const url = res?.data?.data?.url;
        if (url) {
          window.open(
            url,
            "_blank",
            "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes",
          );
        }
      })
      .finally(() => {
        setLaunching(false);
        setGamePlay(null);
      });
  }, [gamePlay]);

  return (
    <>
      {launching && (
        <div className="launch-overlay">
          <Commet color="#FFD700" size="medium" text="" textColor="#fff" />
        </div>
      )}

      <div
        className={`container-fluid ${
          !isMobile ? "container-fluid-5" : "container-fluid-0"
        } cas-in-list`}
      >
        <div className="row row5">
          {providerList.length > 0 && (
            <div
              className="col-xl-2 col-12 d-xl-flex"
              style={{ marginTop: isMobile ? "0px" : "4px",paddingLeft: !isMobile?"0px":"",paddingRight: !isMobile?"0px":"" }}
            >
              <ul
                className="nav nav-pills casino-sub-tab casinoOtherbgNav"
                style={{
                  display: "flex",
                  flexDirection:isMobile ?"row":"column",
                  flexWrap: "nowrap",
                  overflowX: "auto",
                }}
              >
                {providerList.map((p: string, key: number) => (
                  <li className="nav-item" key={key}>
                    <Link
                      className={`nav-link ${
                        activeProvider === p ? "active" : ""
                      }`}
                      onClick={() => onProviderChange(p)}
                      to=""
                      style={{fontSize:!isMobile?'16px':'',fontWeight:!isMobile?'400':'',textTransform:!isMobile?'capitalize':'capitalize'}}
                    >
                      <span>{p}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isLoading ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: "30%",
                height: "10%",
              }}
            >
              <Commet
                color="#acb5ac"
                size="small"
                text=""
                textColor="#a99814"
              />
            </div>
          ) : (
            <>
              {/* Mobile Layout */}
              {isMobile && (
                <div className="col-xl-12 col-12">
                  {categoryList.length > 0 && (
                    <div
                      className="casino-sub-tab-list casino-sub-tab-listNewbg"
                      style={{ marginTop: "0px" }}
                    >
                      <ul
                        className="nav nav-pills casino-sub-tab casino-sub-tabbgremove"
                        id="casino-sub-tab"
                      >
                        {activeProvider !== "ALL" && (
                          <li className="nav-item">
                            <Link
                              className={`nav-link ${
                                activeCategory === "" ? "active" : ""
                              }`}
                              onClick={() => onCategoryChange("")}
                              to=""
                  
                            >
                              <span>All</span>
                            </Link>
                          </li>
                        )}

                        {categoryList.map((cat: string, key: number) => (
                          <li className="nav-item" key={key}>
                            <Link
                              className={`nav-link ${
                                activeCategory === cat ? "active" : ""
                              }`}
                              onClick={() => onCategoryChange(cat)}
                              to=""
                            >
                              <span>{cat}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div
                    className="casino-list casino-listnewwidth mt-2"
                    style={{ marginLeft: "-6px" }}
                  >
                    {games.length > 0 && (
                      <CasinoListItemInt
                        games={games}
                        gamePlay={gamePlay}
                        setGamePlay={setGamePlay}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Desktop Layout */}
              {!isMobile && (
                <>

                <div className="col-xl-10">
                   {categoryList.length > 0 && (
                    <div
                      className="casino-sub-tab-list casino-sub-tab-listNewbg"
                      style={{ marginTop: "4px",background:'none' }}
                    >
                      <ul
                        className="nav nav-pills casino-sub-tab casino-sub-tabbgremove"
                        id="casino-sub-tab" style={{background:'#0088cca5'}}
                      >
                        {activeProvider !== "ALL" && (
                          <li className="nav-item">
                            <Link
                              className={`nav-link ${
                                activeCategory === "" ? "active" : ""
                              }`}
                              onClick={() => onCategoryChange("")}
                              to=""
                              
                            >
                              <span>All</span>
                            </Link>
                          </li>
                        )}

                        {categoryList.map((cat: string, key: number) => (
                          <li className="nav-item" key={key}>
                            <Link
                              className={`nav-link ${
                                activeCategory === cat ? "active" : ""
                              }`}
                              onClick={() => onCategoryChange(cat)}
                              to=""
                              style={{fontSize:'16px',textTransform:'capitalize',fontWeight:'400'}}
                            >
                              <span>{cat}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  

                     <div
                    className="casino-list casino-listnewwidth mt-2"
                    style={{ marginLeft: "0px",padding:!isMobile?'':'' }}
                  >
                    {games.length > 0 && (
                      <CasinoListItemInt  
                        games={games}
                        gamePlay={gamePlay}
                        setGamePlay={setGamePlay}
                      />
                    )}
                  </div>
                </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .launch-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
        }
      `}</style>
    </>
  );
};

export default CasinoOther;
