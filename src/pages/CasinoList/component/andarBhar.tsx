import authService from "../../../services/auth.service";
import { RoleType } from "../../../models/User";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import { betPopup } from "../../../redux/actions/bet/betSlice";
import { IBetOn, IBetType } from "../../../models/IBet";
import CasinoPnl from "./casinoPnl";
import { isMobile } from "react-device-detect";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

const AndarBhar = (props: any) => {
  const { gameCode } = useParams();
  const { lastOdds, liveMatchData } = props;
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  // const cardNameValue: any = { J: 11, Q: 12, K: 13, A: 1 }

  const onBet = (isBack = false, item: any) => {
    console.log("AB4 FINAL BET DATA---------------", {
      gtype: gameCode,
      mid: item?.mid,
      sid: item?.sid,
      b: item?.b,
      gstatus: item?.gstatus,
      marketName: item?.MarketName,
    });
    const ipAddress = authService.getIpAddress();
    const oddVal = item.b;
    const odds = oddVal;
    if (userState.user.role === RoleType.user) {
      if (
        parseFloat(odds) <= 0 ||
        (gameCode === "ab4" || gameCode === "ab3"
          ? Number(item?.b) === 0
          : !item?.gstatus ||
            String(item?.gstatus).toUpperCase() === "SUSPENDED")
      ) {
        return;
      }
      console.log(item, "item____");
      dispatch(
        betPopup({
          isOpen: true,
          betData: {
            isBack,
            odds: parseFloat(odds),
            volume: 100,
            marketId: item.mid,
            marketName: item.MarketName,
            matchId: parseInt(liveMatchData?.match_id) || 0,
            selectionName: `${item.nat}`,
            selectionId: item.sid,
            pnl: 0,
            stack: 0,
            currentMarketOdds: item.b,
            eventId: item.mid,
            exposure: -0,
            ipAddress: ipAddress,
            type: IBetType.Match,
            matchName: liveMatchData.title,
            betOn: IBetOn.CASINO,
            gtype: gameCode,
          },
        }),
      );
    }
  };
  const laybacklayout = useCallback(
    (index: number) => {
      return liveMatchData?.defaultMarkets
        ?.filter((ItemNew: any) => {
          if (gameCode === "ab4" || gameCode === "ab3") {
            return (
              ItemNew.MarketName === "Andar" || ItemNew.MarketName === "Bahar"
            );
          }

          return true;
        })
        ?.map((ItemNew: any, key: number) => {
          // console.log(liveMatchData,'_____live match______')

          const andarCardData = liveMatchData?.ar?.split(",");
          const baharCardData = liveMatchData?.br?.split(",");

          return (
            <>
              <tbody
                className={
                  gameCode === "ab4" || gameCode === "ab3"
                    ? ItemNew.Runners?.some(
                        (runner: any) =>
                          Number(lastOdds?.[runner?.SelectionId]?.b) === 0,
                      )
                      ? "suspended"
                      : ""
                    : ItemNew.Runners?.some(
                        (runner: any) =>
                          String(
                            lastOdds?.[runner?.SelectionId]?.gstatus || "",
                          ).toUpperCase() === "SUSPENDED",
                      )
                    ? "suspended"
                    : ""
                }
                style={{ display: isMobile ? "flex" : "" }}
              >
                {isMobile ? (
                  <tr
                    className={`${
                      ItemNew.MarketName == "Andar" ? "Andar" : "bahar"
                    }`}
                    style={{
                      width: "10%",
                      backgroundColor:
                        gameCode === "ab4" || gameCode === "ab3"
                          ? ItemNew.MarketName === "Andar"
                            ? "#fc424280"
                            : "#fdcf1380"
                          : "",
                    }}
                  >
                    {
                      <td className="td-border-new">
                        <div
                          id="nation1"
                          className="p-title text-center text-vertical-andar border-none"
                          style={{ marginBottom: "0px" }}
                        >
                          {ItemNew.MarketName}
                        </div>
                      </td>
                    }
                  </tr>
                ) : (
                  ""
                )}
                <tr
                  className={`${
                    ItemNew.MarketName == "Andar" ? "Andar" : "bahar"
                  }`}
                  style={{
                    borderRight: isMobile ? "0px" : "",
                    backgroundColor:
                      gameCode === "ab4" || gameCode === "ab3"
                        ? ItemNew.MarketName === "Andar"
                          ? "#fc424280"
                          : "#fdcf1380"
                        : "",
                  }}
                >
                  {!isMobile && (
                    <td style={{ width: "10%" }}>
                      <div
                        id="nation1"
                        className="p-title text-center"
                        style={{ marginBottom: "0px" }}
                      >
                        {ItemNew.MarketName}
                      </div>
                    </td>
                  )}
                  <td id="andar-box" className={`text-center`}>
                    <div
                      className={
                        isMobile
                          ? "row text-center justify-content-center ml-0"
                          : "d-flex justify-content-center"
                      }
                      style={{ marginRight: isMobile ? "0px" : "" }}
                    >
                      {ItemNew.Runners.map(
                        (ItemCardsData: any, keyCardsData: number) => {
                          // console.log(ItemCardsData,'item card data')
                          // console.log(lastOdds,'LAST____________')
                          const Item: any =
                            lastOdds?.[ItemCardsData?.SelectionId] || {};
                          // console.log(Item,'__item')

                          let cardImage = ItemCardsData?.RunnerName?.replace(
                            "Bahar ",
                            "",
                          );
                          cardImage = cardImage?.replace("Ander ", "");
                          // cardImage = cardNameValue?.[cardImage] || cardImage
                          cardImage =
                            ItemNew.MarketName == "Andar"
                              ? andarCardData?.[keyCardsData] || cardImage
                              : baharCardData?.[keyCardsData] || cardImage;

                          if (cardImage > 20) {
                            cardImage = cardImage - 20;
                          }

                          if (cardImage == 1) {
                            cardImage = "A";
                          }

                          if (cardImage == 0) {
                            cardImage = "1";
                          }

                          if (cardImage == 11) {
                            cardImage = "J";
                          }

                          if (cardImage == 12) {
                            cardImage = "Q";
                          }

                          if (cardImage == 13) {
                            cardImage = "K";
                          }

                          return (
                            <>
                              <p style={{ marginBottom: "5px" }}>
                                {/* l value - ONLY FOR AB4 */}
                                {(gameCode === "ab4" || gameCode === "ab3") && (
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                      minHeight: "18px",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {Item?.l}
                                  </div>
                                )}
                                <span
                                  className="game-section m-r-5"
                                  key={keyCardsData}
                                  // onClick={() => {
                                  //   onBet(true, Item);
                                  // }}
                                  onClick={() => {
                                    onBet(true, {
                                      ...Item,
                                      sid: ItemCardsData?.SelectionId,
                                      nat: ItemCardsData?.RunnerName,
                                      mid: Item?.mid || liveMatchData?.match_id,
                                      MarketName: ItemNew?.MarketName,
                                    });
                                  }}
                                >
                                  <img
                                    src={
                                      Number(Item?.b) === 0
                                        ? "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/1.jpg"
                                        : `https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardImage}.png`
                                    }
                                    className="card-image"
                                    style={{
                                      marginBottom: "0px",
                                      height: isMobile ? "45px" : "",
                                      border: "none",
                                    }}
                                  />
                                </span>
                                <div style={{ minHeight: "18px" }}>
                                  <CasinoPnl
                                    sectionId={ItemCardsData?.SelectionId}
                                    matchId={liveMatchData.match_id}
                                    clsName={"text-center"}
                                  />
                                </div>
                              </p>
                            </>
                          );
                        },
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </>
          );
        });
    },
    [liveMatchData, gameCode, lastOdds],
  );

  return (
    <div
      className="container teenpattixyz"
      style={{ marginTop: isMobile ? "0px" : "" }}
    >
      <div className="row">
        <div
          className="col-lg-12 m-b-10 main-market "
          style={{
            padding: isMobile ? "5px" : "0px",
            paddingBottom: isMobile ? "0px" : "",
          }}
        >
          <div className="live-poker">
            <div className={`card-content ${!isMobile ? "m-b-5" : ""}`}>
              <table
                className={`table main-table table-bordered`}
                style={{ marginTop: isMobile ? "10px" : "" }}
              >
                <tbody>{laybacklayout(0)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AndarBhar;
