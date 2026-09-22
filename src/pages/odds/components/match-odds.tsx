/* eslint-disable */
import IMarket, { OddsType } from "../../../models/IMarket";
import { RoleType } from "../../../models/User";
import React, { MouseEvent } from "react";
import IRunner from "../../../models/IRunner";
import { SocketContext } from "../../../context/webSocket";
import { AvailableToBackLay } from "./available-to-back-lay";
import { betPopup } from "../../../redux/actions/bet/betSlice";
import { connect } from "react-redux";
import PnlCalculate from "./pnl-calculate";
// import { checkoddslength } from '../../../utils/helper'
import { isMobile } from "react-device-detect";
import BookPopup from "./fancy/book-popup";
import IMatch from "../../../models/IMatch";
import { setRules } from "../../../redux/actions/common/commonSlice";
import UserBookPopup from "./user-book-popup";
import IBet from "../../../models/IBet";
import { match } from "assert";
import authService from "../../../services/auth.service";
import { useAppSelector } from "../../../redux/hooks";
import { selectCurrentMatch } from "../../../redux/actions/sports/sportSlice";

interface Props {
  data: IMarket[];
  getMarketBook?: any;
  bet?: any;
  fancySelectionId?: any;
  currentMatch?: IMatch;
  setRules: (data: { open: boolean; type: string }) => void;
  marketUserBookId?: any;
  // ✅ ADD THIS
  betPopup: (payload: any) => void;
  user?: any;
}

class MatchOdds extends React.PureComponent<
  Props,
  {
    runnersData: any;
    runnersDataPrev: any;
    profitLoss: any;
    getMarketBook: any;
    remarkMarket: any;
    runnersName: Record<string, string>;
    liveMarketIds: Record<string, boolean>;
  }
> {
  static contextType = SocketContext;
  context!: React.ContextType<typeof SocketContext>;
  constructor(props: Props) {
    super(props);
    const selections: any = {};
    const profitLoss: any = {};
    const remarkMarket: any = {};
    let runnersName: any = {};
    props.data.forEach(async (market: any) => {
      market.runners.forEach((runner: any) => {
        runnersName = {
          ...runnersName,
          [market.marketId]: {
            ...runnersName[market.marketId],
            [runner.selectionId]: runner.runnerName,
          },
        };
        selections[market.marketId] = market;
        profitLoss[runner.selectionId] = 0;
      });
      remarkMarket[market.marketId] = "";
    });
    this.state = {
      runnersData: selections,
      runnersDataPrev: JSON.parse(JSON.stringify(selections)),
      profitLoss,
      getMarketBook: props.getMarketBook,
      remarkMarket: remarkMarket,
      runnersName: runnersName,
      liveMarketIds: {},
    };
  }

  componentDidMount(): void {
    this.socketEvents();
  }

  componentWillUnmount(): void {
    this.context.socket.off("getMarketData");
    this.leaveMarketRoom();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.data !== this.props.data) {
      this.socketEvents();
    }
  }
  logLiveOdds = (market: IMarket) => {
    market.runners.forEach((runner: any) => {
      const backOdds = runner.back?.map((o: any) => o.odds) || [];
      const layOdds = runner.lay?.map((o: any) => o.odds) || [];
    });
  };

  socketEvents = () => {
    this.joinMarketRoom();
    this.getSocketEvents();
    this.context.socket.on("connect", () => {
      this.joinMarketRoom();
    });
    this.context.socket.on("reconnect", () => {
      this.joinMarketRoom();
    });
  };

  joinMarketRoom = () => {
    // joinRoom is now emitted by the parent odds.tsx component instantly on mount
    this.props.data.forEach(async (market: IMarket) => {
      this.context.socket.emit("joinMarketRoom", market.marketId);
    });
  };

  leaveMarketRoom = () => {
    this.props.data.forEach(async (market: any) => {
      this.context.socket.emit("leaveRoom", market.marketId);
      this.context.socket.emit("leaveRoom", market.matchId);
    });
  };
  getSocketEvents = () => {
    const handler = (market: any) => {
      console.log(market, 'market')
      if ((window as any).oddsStartTime) {
        console.warn(`⏱️ TIME TAKEN TO GET FIRST MARKET DATA: ${Date.now() - (window as any).oddsStartTime}ms`);
        delete (window as any).oddsStartTime;
      }
      this.setState((prev: any) => ({
        runnersData: { ...prev.runnersData, [market.marketId]: market },
        remarkMarket: { ...prev.remarkMarket, [market.marketId]: market.rem },
        liveMarketIds: { ...prev.liveMarketIds, [market.marketId]: true },
      }));
    };
    this.context.socket.on("getMarketData", handler);
  };

  offplaylimit = (market: any) => {
    const inplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.inPlayBookMaxLimit
        : this.props.currentMatch?.inPlayMaxLimit;
    const offplayl =
      market.oddsType == OddsType.BM
        ? this.props.currentMatch?.offPlayBookMaxLimit
        : this.props.currentMatch?.offPlayMaxLimit;
    return this.props.currentMatch?.inPlay ? inplayl : offplayl;
  };

  getCurrentOdds = (
    market: IMarket,
    runner: any,
    isBack: boolean
  ): number | null => {
    let currentOdds: number | null = null;

    // First, grab all live odds for this runner
    const backOdds = runner.back?.map((o: any) => o.odds) || [];
    const layOdds = runner.lay?.map((o: any) => o.odds) || [];

    // For BOOKMAKER markets
    if (market.marketName?.toLowerCase().includes("bookmaker") || market.oddsType === "bookMaker") {
      currentOdds =
        runner.odds?.find(
          (o: any) => o.odds > 0 && o.otype === (isBack ? "back" : "lay")
        )?.odds || null;
    } else {
      // For EXCHANGE markets, pick the first available live odds from your arrays
      currentOdds = isBack ? backOdds[0] || null : layOdds[0] || null;
    }

    return currentOdds;
  };

  handleCashout = (market: any, other: any) => {
    const { currentMatch, getMarketBook, betPopup } = this.props;

    if (!currentMatch || !getMarketBook || !market?.runners?.length) {
      return;
    }

    /* ---------------------------------------
   1️⃣ Build PnL map
  --------------------------------------- */
    const pnlMap: Record<number, number> = {};

    market.runners.forEach((runner: any) => {
      const key = `${market.marketId}_${runner.selectionId}`;
      pnlMap[runner.selectionId] = Number(getMarketBook[key] || 0);
    });

    /* ---------------------------------------
   2️⃣ Find +ve and -ve PnL
  --------------------------------------- */
    const values = Object.entries(pnlMap);

    const negative = values.reduce((min, curr) =>
      curr[1] < min[1] ? curr : min
    );

    const positive = values.reduce((max, curr) =>
      curr[1] > max[1] ? curr : max
    );

    if (!positive || !negative) {
      return;
    }

    const selectionId = Number(positive[0]);
    const positivePnl = positive[1];
    const negativePnl = negative[1];

    const runnersPnl = market.runners.map((r: any) => ({
      selectionId: r.selectionId,
      selectionName: r.runnerName,
      pnl: Number(pnlMap[r.selectionId] || 0),
    }));

    /* ---------------------------------------
   3️⃣ Total difference (IMPORTANT FIX)
  --------------------------------------- */
    const diff = positivePnl - negativePnl;

    if (diff <= 0) {
      return;
    }

    /* ---------------------------------------
   4️⃣ Find runner
  --------------------------------------- */
    const runner = market.runners.find(
      (r: any) => r.selectionId === selectionId
    );

    if (!runner) {
      return;
    }

    /* ---------------------------------------
   5️⃣ Get LIVE odds
  --------------------------------------- */
    const backOdds = runner.back?.find((o: any) => o.odds > 1)?.odds || null;

    const layOdds = runner.lay?.find((o: any) => o.odds > 1)?.odds || null;

    if (!backOdds && !layOdds) {
      return;
    }

    /* ---------------------------------------
   6️⃣ Calculate stacks
  --------------------------------------- */
    let calcBackOdds = backOdds;
    let calcLayOdds = layOdds;

    if (market.mname === "Bookmaker") {
      if (backOdds) calcBackOdds = backOdds / 100 + 1;
      if (layOdds) calcLayOdds = layOdds / 100 + 1;
    }
    const backStack = calcBackOdds ? diff / calcBackOdds : Infinity;
    const layStack = calcLayOdds ? diff / calcLayOdds : Infinity;
    const ipAddress = authService.getIpAddress();
    /* ---------------------------------------
   7️⃣ Choose smaller (<=100 preferred)
  --------------------------------------- */
    let isBack = false;
    let stack = 0;
    let odds = 0;

    if (backStack <= layStack && backStack <= 100) {
      isBack = true;
      stack = backStack;
      odds = backOdds!;
    } else if (layStack <= 100) {
      isBack = false;
      stack = layStack;
      odds = layOdds!;
    } else {
      isBack = backStack < layStack;
      stack = Math.min(backStack, layStack);
      odds = isBack ? backOdds! : layOdds!;
    }

    /* ---------------------------------------
   8️⃣ Open CASHOUT popup
  --------------------------------------- */
    const cashoutStack = Number(stack.toFixed(2));
    const cashoutOdds =
      market.mname === "Bookmaker"
        ? isBack
          ? backOdds / 100 + 1
          : layOdds / 100 + 1
        : odds;

    const cashoutPnl = isBack
      ? market.mname === "Bookmaker"
        ? (cashoutOdds - 1) * cashoutStack
        : cashoutOdds * cashoutStack - cashoutStack
      : market.mname === "Bookmaker"
        ? cashoutStack
        : cashoutStack;
    const cashoutExposure = isBack
      ? -cashoutStack
      : market.mname === "Bookmaker"
        ? -(cashoutOdds - 1) * cashoutStack
        : -(cashoutOdds * cashoutStack - cashoutStack);
    const finalCashout = Number(cashoutPnl.toFixed(2));

    betPopup({
      isOpen: true,
      betData: {
        betOn: "MATCH_ODDS",
        marketId: market.marketId,
        currentMarketOdds: odds,
        matchId: currentMatch.matchId,
        marketName: market.mname,
        oddsType: market.mname,

        selectionId: runner.selectionId,
        selectionName: runner.runnerName,

        matchName: currentMatch.name,

        odds: odds,
        stack: cashoutStack,
        pnl: Number(cashoutPnl.toFixed(2)),
        exposure: Number(cashoutExposure.toFixed(2)),

        runnersPnl, // ✅ ADD THIS
        cashoutAmount: Number(cashoutPnl.toFixed(2)), // optional

        ipAddress,
        volume: cashoutStack,
        eventId: other.sportId,
        isBack,
        type: "CASHOUT", // ✅ IMPORTANT
      },
    });
  };

  render(): React.ReactNode {
    const { data, getMarketBook, user } = this.props;
    const cashoutMarketNames = ["MATCH_ODDS", "Bookmaker", "TIED_MATCH"];

    const { runnersData } = this.state;
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const hasAnyLiveData = data?.some((market: any) => {
      const oddsData = runnersData ? runnersData[market.marketId] : null;
      return this.state.liveMarketIds[market.marketId] && oddsData?.runners?.some((r: any) => r.back?.length > 0 || r.lay?.length > 0);
    });

    if (data && data.length > 0 && !hasAnyLiveData) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <i className="fas fa-spinner fa-spin fa-2x" style={{ color: "black" }} />
        </div>
      );
    }

    return (
      <div>
        {data &&
          data.map((market: any) => {
            const selectionsPrev: any = {};
            const oddsData = runnersData ? runnersData[market.marketId] : null;

            // Check if we actually have live odds for this market
            const hasLiveData = oddsData?.runners?.some(
              (runner: any) => runner?.back?.length > 0 || runner?.lay?.length > 0
            );

            // If we haven't received live odds yet, hide the market entirely
            if (!this.state.liveMarketIds[market.marketId] || !hasLiveData) {
              return null;
            }

            const isSingleBackLay = oddsData?.runners?.some(
              (runner: any) =>
                runner?.back?.length === 1 &&
                runner?.lay?.length === 1
            );

            let setVisibleMarketStatus = true;
            // if (oddsData) {
            //   setVisibleMarketStatus = !!oddsData?.['runners']?.[0]?.ex
            // }
            const classforheadingfirst =
              isMobile && market.oddsType != OddsType.BM ? "box-6" : "box-60";
            const classforheading =
              isMobile && market.oddsType != OddsType.BM ? "box-2" : "box-1";
            if (!setVisibleMarketStatus) return null;
            const hasExposure = Object.keys(getMarketBook || {}).some(
              (key) =>
                key.startsWith(market.marketId) &&
                Number(getMarketBook[key]) !== 0
            );

            const marketKey = market.mname || market.marketName || "";

            const showCashout =
              cashoutMarketNames.some(name => marketKey.toLowerCase().includes(name.toLowerCase())) && hasExposure;

            return (
              <div key={market._id}>
                <div className={`market-title ${isMobile ? "" : "mt-1"}`}>
                  <span>{market.marketName}</span>
                  {/* <a
                    href='#Bookmaker-market'
                    onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      this.props.setRules({
                        open: true,
                        type: market.oddsType === OddsType.BM ? 'Bookmaker' : market.oddsType,
                      })
                    }}
                    className='m-r-5 game-rules-icon'
                  >
                    <span>
                      <i className='fa fa-info-circle float-right' />
                    </span>
                  </a> */}
                  <button
                    className="float-right"
                    style={{
                      backgroundColor: showCashout ? "#086f3f" : "#198754",
                      border: "1px solid",
                      borderColor: showCashout ? "#086f3f" : "#198754",
                      padding: isAdminRoute ? "0 0.4rem" : "0.58rem 0.5rem",
                      fontSize: isAdminRoute ? "12px" : "14px",
                      color: "white",
                      cursor: showCashout ? "pointer" : "not-allowed",
                      opacity: showCashout ? 1 : 0.6,
                    }}
                    disabled={!showCashout}
                    onClick={() =>
                      showCashout && this.handleCashout(oddsData, market)
                    }
                  >
                    Cashout
                  </button>
                </div>
                <div className="table-header">
                  <div
                    className={`float-left country-name ${classforheadingfirst} min-max`}
                  >
                    <b />
                  </div>
                  {(!isMobile && market.oddsType != OddsType.BM) ||
                    market.oddsType == OddsType.BM ? (
                    <>
                      <div
                        className="box-1 float-left"
                        style={{
                          width: isMobile ? "" : "40%",
                          maxWidth: isMobile ? "" : "48.3%",
                          minWidth: isMobile ? "" : "48.3%",
                        }}
                      />
                      <div className="box-1 float-left" />
                    </>
                  ) : (
                    ""
                  )}

                  <div
                    className={`back ${classforheading} float-left text-center ${isSingleBackLay ? "single-back-heading" : ""
                      }`}
                  >
                    <b>Back</b>
                  </div>
                  <div
                    className={`lay ${classforheading} float-left text-center ${isSingleBackLay ? "single-lay-heading" : ""
                      }`}
                  >
                    <b>Lay</b>
                  </div>
                  {!isMobile ? (
                    <>
                      <div className="box-1 float-left" />
                      <div className="box-1 float-left" />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                {oddsData &&
                  oddsData?.runners
                    ?.sort(
                      (a: any, b: any) => a?.sortPriority - b?.sortPriority
                    )
                    .map((runner: any) => {
                      let pnlValue = getMarketBook ? getMarketBook[`${market.marketId}_${runner.selectionId}`] : null;
                      if (pnlValue && user && user.role !== RoleType.user) {
                        pnlValue = -pnlValue;
                      }
                      const isSingleBackLay =
                        runner?.back?.length === 1 &&
                        runner?.lay?.length === 1;
                      const countryClass = isSingleBackLay
                        ? "country-name single-back-lay"
                        : "country-name";
                      return (
                        <div key={runner.selectionId}>
                          <div
                            data-title={runner.gstatus}
                            className={`table-row ${runner.gstatus === "SUSPENDED" ? "suspended" : ""
                              }`}
                          >
                            <div
                              className={`${countryClass} ${classforheadingfirst}`}
                              style={{
                                width: isMobile ? "" : "40%",
                                maxWidth: isMobile ? "" : "40%",
                                minWidth: isMobile ? "" : "40%",
                              }}
                            >
                              <span className="team-name">
                                {runner.runnerName}
                              </span>
                              <p>
                                {pnlValue ? (
                                  <span
                                    className={
                                      pnlValue > 0
                                        ? "green"
                                        : "red"
                                    }
                                  >
                                    {pnlValue.toLocaleString()}
                                  </span>
                                ) : (
                                  ""
                                  // <span className='' style={{ color: 'black' }}>
                                  //   {'0'}
                                  // </span>
                                )}

                                <PnlCalculate
                                  marketId={market.marketId}
                                  selectionId={runner.selectionId}
                                />
                              </p>
                            </div>
                            <AvailableToBackLay
                              selections={runner.ex}
                              selectionsPrev={selectionsPrev}
                              market={market}
                              runner={runner}
                            />
                          </div>
                        </div>
                      );
                    })}
                {this.state.remarkMarket[market.marketId] ? (
                  <div className="table-remark text-left remark" style={{ color: "#097c93", padding: "0 5px", fontWeight: "normal" }}>
                    {this.state.remarkMarket[market.marketId]}
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        {this.props.fancySelectionId && <BookPopup />}
        {this.props.marketUserBookId && <UserBookPopup />}
      </div>
    );
  }
}
const mapStateToProps = (state: any) => ({
  bet: state.betReducer.bet,
  getMarketBook: state.betReducer.userBookMarketList,
  fancySelectionId: state.betReducer.fancyMatchAndSelectionId,
  currentMatch: state.sportReducer.currentMatch,
  marketUserBookId: state.betReducer.marketBookAndSelectionId,
  user: state.userReducer?.userData?.user,
});

const actionCreators = {
  betPopup,
  setRules,
};
export default connect(mapStateToProps, actionCreators)(MatchOdds);