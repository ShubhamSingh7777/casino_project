import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  betPopup,
  selectPlaceBet,
} from "../../../redux/actions/bet/betSlice";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import authService from "../../../services/auth.service";
import { RoleType } from "../../../models/User";
import { IBetOn, IBetType } from "../../../models/IBet";
import { IApiStatus } from "../../../models/IApiStatus";

interface SelectionType {
  runnerIndex: number;
  cards: string[];
}

interface UniqueTeenpattiProps {
  lastOdds?: any;
  liveMatchData?: any;
}

export interface CardInfo {
  isClosed: boolean;
  rank: string;
  suit: string;
  symbol: string;
  color: string;
}

/**
 * Parses card codes like "2HH", "QSS", "9DD", "10CC", "1", etc.
 * - Suffix "HH" / "H" => Hearts (♥) in Red
 * - Suffix "DD" / "D" => Diamonds (♦) in Red
 * - Suffix "SS" / "S" => Spades (♠) in Black
 * - Suffix "CC" / "C" => Clubs (♣) in Black
 * - "1", "0", or empty => Closed (face-down)
 */
export const parseCard = (cardRaw: any): CardInfo => {
  if (cardRaw === null || cardRaw === undefined) {
    return { isClosed: true, rank: "", suit: "", symbol: "", color: "" };
  }

  const card = String(cardRaw).trim().toUpperCase();

  if (!card || card === "1" || card === "0" || card === "BACK") {
    return { isClosed: true, rank: "", suit: "", symbol: "", color: "" };
  }

  let rank = "";
  let suit = "";

  if (
    card.endsWith("HH") ||
    card.endsWith("DD") ||
    card.endsWith("SS") ||
    card.endsWith("CC")
  ) {
    suit = card.slice(-2);
    rank = card.slice(0, -2);
  } else if (
    card.endsWith("H") ||
    card.endsWith("D") ||
    card.endsWith("S") ||
    card.endsWith("C")
  ) {
    suit = card.slice(-1);
    rank = card.slice(0, -1);
  } else {
    rank = card;
  }

  if (rank === "1") rank = "A";

  let symbol = "";
  let color = "#000000";

  if (suit.startsWith("H")) {
    symbol = "♥";
    color = "#e53935"; // Red
  } else if (suit.startsWith("D")) {
    symbol = "♦";
    color = "#e53935"; // Red
  } else if (suit.startsWith("S")) {
    symbol = "♠";
    color = "#000000"; // Black
  } else if (suit.startsWith("C")) {
    symbol = "♣";
    color = "#000000"; // Black
  }

  return {
    isClosed: false,
    rank,
    suit,
    symbol,
    color,
  };
};

const UniqueTeenpatti = ({
  lastOdds,
  liveMatchData,
}: UniqueTeenpattiProps) => {
  const { gameCode } = useParams();
  const dispatch = useAppDispatch();

  const userState = useAppSelector(selectUserData);
  const getPlaceBet = useAppSelector(selectPlaceBet);

  const [selection, setSelection] = useState<SelectionType>({
    runnerIndex: -1,
    cards: [],
  });

  // Market & Runner detection
  const market =
    liveMatchData?.event_data?.market?.[0] ||
    lastOdds?.market?.[0];

  const runner =
    market?.Runners?.[0] ||
    lastOdds?.market?.[0]?.Runners?.[0] ||
    (market?.sid ? market : undefined);

  const marketStatus =
    runner?.gstatus ??
    market?.gstatus ??
    lastOdds?.market?.[0]?.Runners?.[0]?.gstatus ??
    lastOdds?.market?.[0]?.gstatus;

  const isOpen = String(marketStatus ?? "").toUpperCase() === "OPEN";

  // Extract all 6 cards from multiple potential structures
  const getSixCards = (): string[] => {
    // 1. Try comma-separated string or array in cards property
    const rawCards =
      liveMatchData?.cards ??
      lastOdds?.cardsstring ??
      liveMatchData?.lastResult?.cards ??
      liveMatchData?.results?.[0]?.cards;

    if (rawCards) {
      const arr = Array.isArray(rawCards)
        ? rawCards
        : String(rawCards).split(",");
      if (arr.length >= 6) {
        return arr.slice(0, 6).map((c: any) => String(c ?? "1").trim() || "1");
      }
    }

    // 2. Try individual C1-C6 fields
    const individual = [
      liveMatchData?.C1 ?? lastOdds?.cards?.C1,
      liveMatchData?.C2 ?? lastOdds?.cards?.C2,
      liveMatchData?.C3 ?? lastOdds?.cards?.C3,
      liveMatchData?.C4 ?? lastOdds?.cards?.C4,
      liveMatchData?.C5 ?? lastOdds?.cards?.C5,
      liveMatchData?.C6 ?? lastOdds?.cards?.C6,
    ];

    if (
      individual.some(
        (c) => c !== undefined && c !== null && String(c).trim() !== ""
      )
    ) {
      return individual.map((c) => String(c ?? "1").trim() || "1");
    }

    return ["1", "1", "1", "1", "1", "1"];
  };

  const cardNumbers = [1, 2, 3, 4, 5, 6];
  const sixCards = getSixCards();

  // Unique Teen Patti market detection
  const getTripleMarket = () => {
    return (
      runner ??
      market?.Runners?.[0] ??
      lastOdds?.market?.[0]?.Runners?.[0] ??
      lastOdds?.[3] ??
      lastOdds?.market?.[2] ??
      lastOdds?.market?.[3] ??
      lastOdds?.market?.[0]
    );
  };

  const placeBet = (
    runnerName: string,
    cards: string[],
    itemMarket: any
  ) => {
    if (!itemMarket) return;

    const oddsVal = Number(itemMarket.b);
    const itemStatus = String(
      itemMarket.gstatus ?? marketStatus ?? ""
    ).toUpperCase();

    if (!Number.isFinite(oddsVal) || oddsVal <= 0 || itemStatus !== "OPEN") {
      return;
    }

    if (userState.user?.role !== RoleType.user) {
      return;
    }

    const ipAddress = authService.getIpAddress();
    const matchId =
      liveMatchData?.match_id ||
      liveMatchData?.event_data?.match_id ||
      lastOdds?.mid ||
      0;

    dispatch(
      betPopup({
        isOpen: true,
        betData: {
          isBack: true,
          odds: oddsVal,
          volume: itemMarket.bs || 0,
          marketId: itemMarket.mid || matchId,
          marketName: itemMarket.MarketName || "Teen Unique",
          matchId: matchId,

          selectionName: `${itemMarket.runnerName || runnerName} ${cards.join("")}`,
          selectionId: itemMarket.sid || itemMarket.sectionId,

          pnl: 0,
          stack: 0,
          currentMarketOdds: itemMarket.b,
          eventId: itemMarket.mid || matchId,
          exposure: 0,
          ipAddress,

          minbet: Number(itemMarket.min || liveMatchData?.min || 100),
          maxbet: Number(itemMarket.max || liveMatchData?.max || 100000),

          type: IBetType.Match,
          matchName: liveMatchData?.title || "Teen Unique",
          betOn: IBetOn.CASINO,
          gtype: gameCode || "teenunique",

          // Card selection payload
          C1: cards[0] || "",
          C2: cards[1] || "",
          C3: cards[2] || "",
        },
      })
    );
  };

  // Select three cards
  const onCardClick = (cardNumStr: string) => {
    if (!isOpen) return;

    setSelection((previous) => {
      // Toggle card if already selected
      if (previous.cards.includes(cardNumStr)) {
        return {
          ...previous,
          cards: previous.cards.filter((c) => c !== cardNumStr),
        };
      }

      // Maximum of three cards
      if (previous.cards.length >= 3) {
        return previous;
      }

      return {
        runnerIndex: 2,
        cards: [...previous.cards, cardNumStr],
      };
    });
  };

  const onClearSelection = () => {
    setSelection({
      runnerIndex: -1,
      cards: [],
    });
  };

  const onPlaceBetClick = () => {
    if (selection.cards.length !== 3) return;
    const itemMarket = getTripleMarket();
    if (!itemMarket) return;
    placeBet("Triple", selection.cards, itemMarket);
  };

  // Clear selection when the bet process finishes
  useEffect(() => {
    if (getPlaceBet.status === IApiStatus.Done) {
      setSelection({
        runnerIndex: -1,
        cards: [],
      });
    }
  }, [getPlaceBet.status]);

  // Clear pending selections if the market closes
  useEffect(() => {
    if (!isOpen) {
      setSelection({
        runnerIndex: -1,
        cards: [],
      });
    }
  }, [isOpen]);

  return (
    <div className="my-bet">
      <div className="new-casino">
        <div className="card-content col-12 live-poker unique-teenpatti-ui">
          <div className="unique-teenpatti-heading">
            Select any 3 cards of your choice and experience TeenPatti
            in a unique way.
            <i className="fas fa-hand-point-down ms-1" />
          </div>

          <div className="unique-teenpatti-cards">
            {cardNumbers.map((num, index) => {
              const cardValue = sixCards[index] || "1";
              const isSuspended = !isOpen;
              const isSelected = selection.cards.includes(String(num));
              const cardInfo = parseCard(cardValue);
              const isCardSuspended = isSuspended && cardInfo.isClosed;

              return (
                <div
                  key={num}
                  className={`unique-teenpatti-card-wrapper ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => onCardClick(String(num))}
                >
                  <div className="unique-teenpatti-number">
                    {num}
                  </div>

                  <div
                    className={`unique-teenpatti-card ${
                      cardInfo.isClosed ? "face-down" : "revealed"
                    } ${isCardSuspended ? "suspended" : ""} ${
                      isSelected ? "selected" : ""
                    }`}
                    style={{
                      cursor: isOpen && cardInfo.isClosed ? "pointer" : "default",
                    }}
                  >
                    <img
                      src={
                        cardInfo.isClosed
                          ? "https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/1.jpg"
                          : `https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardValue}.jpg`
                      }
                      alt={`Card ${num}: ${cardValue}`}
                      className="wd-casino"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!cardInfo.isClosed && target.src.endsWith(".png")) {
                          target.src = `https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${cardValue}.jpg`;
                        } else {
                          target.onerror = null;
                          target.src = "/imgs/card/patti_back.jpg";
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar: Selected cards preview + Clear & Placebet buttons (Matching Image 1) */}
          {/* Bottom Bar: Appears ONLY when at least 1 card is selected */}
          {selection.cards.length > 0 && (
            <div className="unique-teenpatti-bottom-bar">
              <div className="unique-teenpatti-selected-preview">
                {selection.cards.map((cardNum) => (
                  <div key={cardNum} className="unique-teenpatti-mini-card">
                    <img
                      src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/1.jpg"
                      alt={`Card ${cardNum}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/imgs/card/patti_back.jpg";
                      }}
                    />
                    <div className="unique-teenpatti-mini-circle">{cardNum}</div>
                  </div>
                ))}
              </div>

              <div className="unique-teenpatti-action-buttons">
                <button
                  type="button"
                  className="unique-btn-clear"
                  onClick={onClearSelection}
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="unique-btn-placebet"
                  onClick={onPlaceBetClick}
                  disabled={selection.cards.length !== 3 || !isOpen}
                  style={{
                    opacity: selection.cards.length === 3 && isOpen ? 1 : 0.6,
                    cursor: selection.cards.length === 3 && isOpen ? "pointer" : "not-allowed",
                  }}
                >
                  Placebet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UniqueTeenpatti);
