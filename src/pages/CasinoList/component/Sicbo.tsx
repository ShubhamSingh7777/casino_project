import React from "react";
import { isMobile } from "react-device-detect";
import Limitinfo from "./_common/limitinfo";
import BackButtonPnl from "./_common/new/BackButtonPnl";
import CasinoPnl from "./casinoPnl";

const Sicbo = (props: any) => {
  const { lastOdds, liveMatchData } = props;

  // const markets = liveMatchData?.defaultMarkets || [];
  const markets = liveMatchData?.event_data?.market || [];
  console.log("EVENT ID:", liveMatchData?.match_id);
  console.log("EVENT MARKETS Sicbo:", markets);

  // -------------------------------------------------------
  // Find market by name
  // -------------------------------------------------------
  const getMarket = (name: string) => {
    return markets.find(
      (item: any) => item?.MarketName?.toLowerCase() === name.toLowerCase(),
    );
  };

  // -------------------------------------------------------
  // Get runner
  // -------------------------------------------------------
  const getRunner = (marketName: string, index: number) => {
    const market = getMarket(marketName);

    return market?.Runners?.[index] || null;
  };

  // -------------------------------------------------------
  // Get odds
  // -------------------------------------------------------
  const getOdds = (runner: any) => {
    if (!runner) return "-";

    const selectionId = runner.SelectionId;

    const odds = lastOdds?.[selectionId]?.b ?? runner?.b ?? 0;

    return `${odds}:1`;
  };

  // -------------------------------------------------------
  // Render actual betting button
  // -------------------------------------------------------
const renderBet = (runner: any, extraClass = "") => {
  if (!runner) return null;

  const sid = runner?.sid;
  const marketId = liveMatchData?.match_id;

  const itemMarket = lastOdds?.[sid] || {};
  const status = itemMarket?.gstatus;

  const suspended =
    !status ||
    status === "0" ||
    status === "SUSPENDED" ||
    status === "CLOSED";

  return (
    <div
      className={`sicbo-bet-wrapper ${
        suspended ? "sicbo-suspended" : ""
      } ${extraClass}`}
    > 
    
      <BackButtonPnl
        selectionid={sid}
        lastOdds={lastOdds}
        liveMatchData={liveMatchData}
        clsnamename="back sicbo-back-button"
        needSuspend={true}
        sectionId={sid}
      />  <div className="casinopnlvalueText">
    
  <CasinoPnl
    matchId={marketId}
    sectionId={sid}
    slug="sicbo"
    clsName="text-center"
  />
</div>
   
    </div>
  );
};
  // -------------------------------------------------------
  // Dice
  // -------------------------------------------------------
  //   const Dice = ({
  //     value,
  //     size = "normal",
  //   }: {
  //     value: number;
  //     size?: "small" | "normal";
  //   }) => {
  //     const pips = Array.from(
  //       { length: value },
  //       (_, index) => index
  //     );

  //     return (
  //       <div className={`sicbo-dice ${size}`}>
  //         {pips.map((_, index) => (
  //           <span
  //             key={index}
  //             className={`pip pip-${value}-${index}`}
  //           />
  //         ))}
  //       </div>
  //     );
  //   };

  const Dice = ({
    value,
    size = "normal",
  }: {
    value: number;
    size?: "small" | "normal";
  }) => {
    return (
      <img
        src={`/imgs/diceNew/dice${value}.png`}
        alt={`Dice ${value}`}
        className={`sicbo-dice-image ${size}`}
      />
    );
  };
  // -------------------------------------------------------
  // Dice group
  // -------------------------------------------------------
  const DiceGroup = ({ values }: { values: number[] }) => {
    return (
      <div className="dice-group">
        {values.map((value, index) => (
          <Dice key={index} value={value} size="small" />
        ))}
      </div>
    );
  };

  // -------------------------------------------------------
  // Market runner cell
  // -------------------------------------------------------
  const MarketCell = ({
    marketName,
    index,
    label,
    dice,
    className = "",
    hideOdds = false,
  }: {
    marketName: string;
    index: number;
    label?: string;
    dice?: number[];
    className?: string;
    hideOdds?: boolean;
  }) => {
    const runner = getRunner(marketName, index);

    if (!runner) {
      return (
        <div className={`sicbo-cell ${className}`}>
          {dice ? <DiceGroup values={dice} /> : null}

          {label && <div className="sicbo-label">{label}</div>}
        </div>
      );
    }

    return (
      <div className={`sicbo-cell ${className}`}>
        {label && <div className="sicbo-label">{label}</div>}

        {dice && <DiceGroup values={dice} />}

        {/* Show odds only when there is NO dice image */}
        {!hideOdds && !dice && (
          <div className="sicbo-odds">{getOdds(runner)}</div>
        )}

        {renderBet(runner)}
      </div>
    );
  };

  // -------------------------------------------------------
  // Top Total numbers
  // -------------------------------------------------------
  const totalNumbers = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  // -------------------------------------------------------
  // Dice combinations
  //
  // API gives 15 runners, therefore we keep 15
  // combinations in the same order as screenshot.
  // -------------------------------------------------------
  const combinations = [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],

    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],

    [3, 3],
    [3, 4],
    [3, 5],

    [4, 4],
    [4, 5],

    [5, 5],
  ];

  // -------------------------------------------------------
  // Single
  // -------------------------------------------------------
  const singles = [1, 2, 3, 4, 5, 6];

  // -------------------------------------------------------
  // Double
  // -------------------------------------------------------
  const doubles = [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
    [6, 6],
  ];

  // -------------------------------------------------------
  // Triple
  // -------------------------------------------------------
  const triples = [
    [1, 1, 1],
    [2, 2, 2],
    [3, 3, 3],
    [4, 4, 4],
    [5, 5, 5],
    [6, 6, 6],
  ];

  const bigSmall = getMarket("BigSmall");
  const oddEven = getMarket("OddEven");
  const anyTriple = getMarket("Any Triple");
  const total = getMarket("Total");

  const isOpen = (market: any) => {
    if (!market?.Runners?.length) return false;

    return market.Runners.some((runner: any) => {
      const data = lastOdds?.[runner.SelectionId];

      return (
        data?.gstatus === "OPEN" ||
        data?.gstatus === "1" ||
        runner?.gstatus === "OPEN"
      );
    });
  };
  const isRunnerSuspended = (runner: any) => {
    if (!runner) return true;

    const status = lastOdds?.[runner?.sid]?.gstatus;

    return (
      !status || status === "0" || status === "SUSPENDED" || status === "CLOSED"
    );
  };
  return (
    <div className="sicbo-container">
      {/* ================= MOBILE LAYOUT ================= */}
      {isMobile && (
        <div className="sicbo-mobile">
          {/* TOP HEADER */}
          <div className="mobile-top-header">
            <div className="mobile-header-box">1:1 Lose if Any Triple</div>

            <div className="mobile-header-box center">30:1</div>

            <div className="mobile-header-box">1:1 Lose if Any Triple</div>
          </div>

          {/* SMALL / ODD / ANY TRIPLE / EVEN / BIG */}
          <div className="mobile-main-top">
            <div className="mobile-main-topFlex">
              {/* SMALL */}
              <div
                className={`mobile-side-cell ${
                  isRunnerSuspended(getRunner("BigSmall", 1)) ? "suspended" : ""
                }`}
              >
                <div className="side-title">SMALL</div>
                <div className="side-range">4-10</div>

                {renderBet(getRunner("BigSmall", 0), "side-bet")}
              </div>

              {/* ODD */}
              <div
                className={
                  isRunnerSuspended(getRunner("OddEven", 1))
                    ? "mobile-market-wrapper suspended"
                    : "mobile-market-wrapper"
                }
              >
                <MarketCell
                  marketName="OddEven"
                  index={0}
                  label="ODD"
                  className="mobile-market-cell OddevenMobile"
                />
              </div>
            </div>
            {/* ANY TRIPLE */}
            <div
              className={
                isRunnerSuspended(getRunner("Any Triple", 0))
                  ? "mobile-market-wrapper anyTripleMobile suspended"
                  : "mobile-market-wrapper anyTripleMobile"
              }
            >
              <MarketCell
                marketName="Any Triple"
                index={0}
                label="ANY TRIPLE"
                className="mobile-market-cell"
                hideOdds={true}
              />
            </div>
            <div className="mobile-main-topFlex">
              {/* EVEN */}
              <div
                className={
                  isRunnerSuspended(getRunner("OddEven", 1))
                    ? "mobile-market-wrapper suspended"
                    : "mobile-market-wrapper"
                }
              >
                <MarketCell
                  marketName="OddEven"
                  index={1}
                  label="EVEN"
                  className="mobile-market-cell oddEvenMobile2"
                />
              </div>
              {/* BIG */}
              <div
                className={`mobile-side-cell ${
                  isRunnerSuspended(getRunner("BigSmall", 1)) ? "suspended" : ""
                }`}
              >
                <div className="side-title">BIG</div>
                <div className="side-range">11-17</div>

                {renderBet(getRunner("BigSmall", 1), "side-bet")}
              </div>
            </div>
          </div>

          {/* ================= DOUBLE ================= */}
          <div className="mobile-section sicbodoubleCont">
            <div className="mobile-section-title">8:1 Each Double</div>

            <div className="mobile-six-grid">
              {doubles.map((dice, index) => (
                <MarketCell
                  key={index}
                  marketName="Double"
                  index={index}
                  dice={dice}
                  className="mobile-dice-cell"
                />
              ))}
            </div>
          </div>

          {/* ================= TRIPLE ================= */}
          <div className="mobile-section eachTripleCont">
            <div className="mobile-section-title">150:1 Each Triple</div>

            <div className="mobile-six-grid">
              {triples.map((dice, index) => (
                <MarketCell
                  key={index}
                  marketName="Triple"
                  index={index}
                  dice={dice}
                  className="mobile-dice-cell"
                />
              ))}
            </div>
          </div>

          {/* ================= TOTALS ================= */}
          <div className="mobile-total-grid">
            {totalNumbers.map((number, index) => (
              <MarketCell
                key={number}
                marketName="Total"
                index={index}
                label={`${number}`}
                className="mobile-total-cell"
              />
            ))}
          </div>

          {/* ================= TWO DICE ================= */}
          <div className="mobile-section">
            <div className="mobile-section-title">5:1 Two Dice</div>

            <div className="mobile-five-grid">
              {combinations.map((dice, index) => (
                <MarketCell
                  key={index}
                  marketName="Combination"
                  index={index}
                  dice={dice}
                  className="mobile-combination-cell"
                />
              ))}
            </div>
          </div>

          {/* ================= SINGLE / DOUBLE / TRIPLE HEADER ================= */}
          <div className="mobile-single-double-header">
            <div>1:1 on Single</div>
            <div>2:1 on Double</div>
            <div>3:1 on Triple</div>
          </div>

          {/* ================= SINGLE ================= */}
          <div className="mobile-single-grid">
            {singles.map((value, index) => (
              <MarketCell
                key={value}
                marketName="Single"
                index={index}
                dice={[value]}
                className="mobile-single-cell"
              />
            ))}
          </div>
        </div>
      )}

      {/* =================================================
          TOP HEADER
      ================================================= */}
      {!isMobile && (
        <>
          <div className="sicbo-top-header">
            <div className="sicbo-header-box">1:1 Lose if Any Triple</div>

            <div className="sicbo-header-box center">30:1</div>

            <div className="sicbo-header-box">1:1 Lose if Any Triple</div>
          </div>

          <div className="sicbo-main-board">
            {/* SMALL */}
            {/* SMALL */}
            <div
              className={`sicbo-side-market ${
                (() => {
                  const runner = getRunner("BigSmall", 0);
                  const status = lastOdds?.[runner?.SelectionId]?.gstatus;

                  return (
                    status === "0" ||
                    status === "SUSPENDED" ||
                    status === "CLOSED"
                  );
                })()
                  ? "suspended"
                  : ""
              }`}
            >
              <div className="side-title">SMALL</div>

              <div className="side-range">4-10</div>

              {renderBet(getRunner("BigSmall", 0), "side-bet")}
            </div>

            {/* CENTER */}
            <div className="sicbo-center-board">
              {/* ---------------------------------------------
              TOP ROW
          --------------------------------------------- */}
              <div className="sicbo-top-row">
                {/* ODD */}
                <MarketCell
                  marketName="OddEven"
                  index={0}
                  label="ODD"
                  className="odd-even-cell"
                />

                {/* TOTALS 4 - 10 */}
                {totalNumbers.slice(0, 7).map((number, index) => (
                  <MarketCell
                    key={number}
                    marketName="Total"
                    index={index}
                    label={`${number}`}
                    className="total-cell"
                  />
                ))}

                {/* ANY TRIPLE */}
                <MarketCell
                  marketName="Any Triple"
                  index={0}
                  label="ANY TRIPLE"
                  className="any-triple-cell"
                  hideOdds={true}
                />
                {/* TOTALS 11 - 17 */}
                {totalNumbers.slice(7).map((number, index) => (
                  <MarketCell
                    key={number}
                    marketName="Total"
                    index={index + 7}
                    label={`${number}`}
                    className="total-cell"
                  />
                ))}
              </div>

              {/* ---------------------------------------------
              EVEN
          --------------------------------------------- */}
              <div className="sicbo-even-row">
                <MarketCell
                  marketName="OddEven"
                  index={1}
                  label="EVEN"
                  className="even-cell"
                />
              </div>

              {/* ---------------------------------------------
              ODDS BAR
          --------------------------------------------- */}
              <div className="sicbo-odds-info">
                <div className="sicbo-odds-info-3set">
                  <div>1:1 on Single</div>

                  <div>2:1 on Double</div>

                  <div>3:1 on Triple</div>
                </div>

                <div className="double-info">8:1 Each Double</div>

                <div className="triple-info">150:1 Each Triple</div>
              </div>

              {/* ---------------------------------------------
              SINGLE + DOUBLE + TRIPLE
          --------------------------------------------- */}
              <div className="sicbo-dice-row">
                {/* SINGLE */}
                <div className="dice-market single-market">
                  {singles.map((value, index) => (
                    <MarketCell
                      key={value}
                      marketName="Single"
                      index={index}
                      dice={[value]}
                    />
                  ))}
                </div>

                {/* DOUBLE */}
                <div className="dice-market double-market">
                  {doubles.map((dice, index) => (
                    <MarketCell
                      key={index}
                      marketName="Double"
                      index={index}
                      dice={dice}
                    />
                  ))}
                </div>

                {/* TRIPLE */}
                <div className="dice-market triple-market">
                  {triples.map((dice, index) => (
                    <MarketCell
                      key={index}
                      marketName="Triple"
                      index={index}
                      dice={dice}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* BIG */}
            <div
              className={`sicbo-side-market ${
                (() => {
                  const runner = getRunner("BigSmall", 0);
                  const status = lastOdds?.[runner?.SelectionId]?.gstatus;

                  return (
                    status === "0" ||
                    status === "SUSPENDED" ||
                    status === "CLOSED"
                  );
                })()
                  ? "suspended"
                  : ""
              }`}
            >
              <div className="side-title">BIG</div>

              <div className="side-range">11-17</div>

              {renderBet(getRunner("BigSmall", 1), "side-bet")}
            </div>
          </div>

          <div className="sicbo-combination">
            <div className="combination-title">5:1 Two Dice</div>

            <div className="combination-row">
              {combinations.map((dice, index) => (
                <MarketCell
                  key={index}
                  marketName="Combination"
                  index={index}
                  dice={dice}
                  className="combination-cell"
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sicbo;
