import Limitinfo from "./_common/limitinfo";
import BookmakerMarket from "./_common/bookmakerMarket";
import FancyMarket from "./_common/fancyMarket";
import { isMobile } from "react-device-detect";

const FiveCricket = (props: any) => {
  const { liveMatchData } = props;

  const markets = liveMatchData?.event_data?.market || [];

  console.log(markets, "FIVE CRICKET MARKETS");

  if (!markets.length) {
    return null;
  }

  return (
    <div className="container">
      <div className="row superover">
        {markets.map((ItemNew: any, key: number) => {
          const clsName = "col-lg-12";

          // Do not render completely empty markets
          if (!ItemNew?.Runners || ItemNew.Runners.length === 0) {
            return null;
          }

          const marketName = ItemNew?.MarketName?.trim()?.toLowerCase() || "";

          const isBookmaker = marketName.includes("bookmaker");

          // Same concept as SuperOver Fancy/Fancy1
          const isFancy =
            marketName.includes("fancy") || marketName === "fancy1 market";

          return (
            <div
              className={`${clsName} main-market`}
              style={{ padding: "0px" }}
              key={ItemNew?.MarketName || key}
            >
              <div className={`card ${isMobile ? "m-b-0" : "m-b-5"} my-bet`}>
                {/* ================= HEADER ================= */}
                {!isFancy && (
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
                      {isBookmaker ? "Bookmaker" : ItemNew?.MarketName}

                      <span className="float-right">
                        <Limitinfo
                          max={liveMatchData?.event_data?.max}
                          min={liveMatchData?.event_data?.min}
                          nameString={ItemNew?.MarketName?.replace(/\s+/g, "")}
                        />
                      </span>
                    </h6>
                  </div>
                )}

                {/* ================= MARKET ================= */}
                <div
                  className="card-body"
                  style={{
                    padding: "0px",
                    textAlign: "right",
                  }}
                >
                  {/* BOOKMAKER */}
                  {isBookmaker && (
                    <BookmakerMarket
                      oddsMarket={ItemNew}
                      lastOdds={liveMatchData}
                      isFiveCricket={true}
                      
                    />
                  )}

                  {/* FANCY / FANCY1 */}
                  {isFancy && (
                    <FancyMarket
                      oddsMarket={ItemNew}
                      lastOdds={liveMatchData}
                      isFiveCricket={true}
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

export default FiveCricket;