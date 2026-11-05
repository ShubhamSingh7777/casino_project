import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { useState } from "react";
import Limitinfo from "./_common/limitinfo";
import BookmakerMarket from "./_common/bookmakerMarket";
import FancyMarket from "./_common/fancyMarket";
import { isMobile } from "react-device-detect";

const SuperOver = (props: any) => {
  const { lastOdds, liveMatchData } = props;
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);

  const getCurrentMatch = liveMatchData?.defaultMarkets || [];

  const isSuperOver3 = window.location.pathname.includes("superover3");

  const [updateOdds, setUpdateOdds] = useState<any>(undefined);

  /*
   * Get Fancy1 Market
   */
  const fancy1Market = lastOdds?.market?.find(
    (item: any) => item?.MarketName?.trim()?.toLowerCase() === "fancy1 market",
  );

  /*
   * Get Tie runner from Fancy1 Market
   */
  const tieRunner = fancy1Market?.Runners?.find(
    (runner: any) => runner?.runnerName?.trim()?.toLowerCase() === "tie",
  );

  /*
   * Remove Tie from Fancy1
   */
  const fancy1WithoutTie = fancy1Market
    ? {
        ...fancy1Market,
        Runners:
          fancy1Market.Runners?.filter(
            (runner: any) =>
              runner?.runnerName?.trim()?.toLowerCase() !== "tie",
          ) || [],
      }
    : null;

  /*
   * Create separate Tie market
   */
  const tieMarket = tieRunner
    ? {
        ...fancy1Market,
        MarketName: "Tie",
        Runners: [tieRunner],
      }
    : null;

  // console.log(lastOdds)

  return (
    <div className="container">
      {/* Normal Markets */}
      <div className="row superover">
        {getCurrentMatch.map((ItemNew: any, key: number) => {
          const clsName = "col-lg-12";

          /*
           * Get odds market
           */
          let oddsMarket =
            lastOdds?.market?.find(
              (ItemM: any) => ItemNew.MarketName === ItemM.MarketName,
            ) || {};

          /*
           * For superover3, remove Tie from Fancy1
           */
          if (
            isSuperOver3 &&
            ItemNew?.MarketName?.trim()?.toLowerCase() === "fancy1 market"
          ) {
            oddsMarket = fancy1WithoutTie;
          }

          if (!oddsMarket?.Runners || oddsMarket.Runners.length === 0) {
            return null;
          }

          return (
            <div
              className={`${clsName} main-market`}
              style={{ padding: "0px" }}
              key={key}
            >
              {/* =========================================
                  TIE - SHOW BEFORE FANCY1
                 ========================================= */}

              {isSuperOver3 &&
                ItemNew?.MarketName?.trim()?.toLowerCase() ===
                  "fancy1 market" &&
                tieMarket?.Runners?.length > 0 && (
                  <div
                    className="row superover tie-market"
                    style={{
                      marginBottom: "1px",
                      marginRight: "0px",
                      marginLeft: "0px",
                    }}
                  >
                    <div
                      className="col-lg-12 main-market"
                      style={{ padding: "0px" }}
                    >
                      <div
                        className={`card ${
                          isMobile ? "m-b-0" : "m-b-5"
                        } my-bet`}
                      >
                        {!isMobile && (
                          <div
                            className="card-header casino"
                            style={{
                              padding: "4px",
                              backgroundColor: "#2c3e50d9",
                            }}
                          >
                            <h6
                              className="card-title d-inline-block"
                              style={{
                                fontSize: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Tie
                              <span className="float-right">
                                <Limitinfo
                                  max={lastOdds.max}
                                  min={lastOdds.min}
                                  nameString="Tie"
                                />
                              </span>
                            </h6>
                          </div>
                        )}

                        <div
                          className="card-body"
                          style={{
                            padding: "0px",
                            textAlign: "right",
                          }}
                        >
                          <FancyMarket
                            oddsMarket={tieMarket}
                            lastOdds={liveMatchData}
                            isTie={true}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* =========================================
                  EXISTING MARKET
                 ========================================= */}

              <div className={`card ${isMobile ? "m-b-0" : "m-b-5"} my-bet`}>
                {((isMobile &&
                  !ItemNew.MarketName.includes("Fancy1") &&
                  !ItemNew.MarketName.includes("Fancy")) ||
                  !isMobile) && (
                  <div
                    className="card-header casino"
                    style={{
                      padding: !isMobile ? "4px" : "",
                      backgroundColor: !isMobile ? "#2c3e50d9" : "",
                    }}
                  >
                    <h6
                      className="card-title d-inline-block"
                      style={{
                        fontSize: !isMobile ? "15px" : "",
                        fontWeight: !isMobile ? "bold" : "",
                      }}
                    >
                      {/* {ItemNew.MarketName} */}
                      {isSuperOver3 &&
                      ItemNew?.MarketName?.trim()?.toLowerCase() ===
                        "match odds"
                        ? "Bookmaker"
                        : ItemNew.MarketName}

                      <span className="float-right">
                        <Limitinfo
                          max={lastOdds.max}
                          min={lastOdds.min}
                          nameString={ItemNew.MarketName.replace(" ", "")}
                        />
                      </span>
                    </h6>
                  </div>
                )}

                <div
                  className="card-body"
                  style={{
                    padding: "0px",
                    textAlign: "right",
                  }}
                >
                  {key === 0 ? (
                    <BookmakerMarket
                      oddsMarket={oddsMarket}
                      lastOdds={liveMatchData}
                    />
                  ) : (
                    <FancyMarket
                      oddsMarket={oddsMarket}
                      lastOdds={liveMatchData}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuperOver;
