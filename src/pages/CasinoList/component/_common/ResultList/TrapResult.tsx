import React from "react";

interface TrapResultProps {
  resultHtml: any;
}

const TrapResult = ({
  resultHtml,
}: TrapResultProps) => {
  const istwocard = resultHtml.ename === "2 Cards Teenpatti";

  // Get cards directly from API
  const cards = resultHtml.card?.split(",") || [];

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  const poison = cards.slice(0, 3);
  const playerAP = cards.slice(3, 6);

  // 2 Cards Teenpatti
  const playerAtwo = cards.slice(0, 2);
  const playerBtwo = cards.slice(2, 4);

  const winner = rdescParts[0]?.trim() || "";
  const oddEvenData = rdescParts[1]?.trim() || "";
  const consecutiveData = rdescParts[2]?.trim() || "";

  // Calculate total directly from API card values
  const getCardValue = (card: string): number => {
    const value = card.replace(/[^0-9AKQJ]/gi, "").toUpperCase();

    if (value === "A") return 1;
    if (value === "J") return 11;
    if (value === "Q") return 12;
    if (value === "K") return 13;

    const number = parseInt(value, 10);

    return isNaN(number) ? 0 : number;
  };

  const calculateTotal = (playerCards: string[]): number => {
    return playerCards
      .filter((card: string) => card !== "1")
      .reduce((total: number, card: string) => {
        return total + getCardValue(card);
      }, 0);
  };

  // Total directly from API data
  const totalA = calculateTotal(playerAtwo);
  const totalB = calculateTotal(playerBtwo);

  const createCards = (playerCards: string[]) => {
    return playerCards
      .filter((card: string) => card !== "1")
      .map((card: string) => {
        const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

        return `
          <img
            src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
            alt="${safeCard}"
            style="
              width:auto;
              height:35px;
              margin:3px;
            "
          />
        `;
      })
      .join("");
  };

  const poisonCards = createCards(poison);
  const playerACardsp = createCards(playerAP);
  const playerACardsP = createCards(playerAtwo);
  const playerBCardsP = createCards(playerBtwo);

  return `
    <div style="text-align:center;">

      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        ${istwocard ? "Player A": `Player A (${totalA})`}
      </div>

      ${
        istwocard
          ? `
            <div style="
              display:flex;
              justify-content:center;
              align-items:center;
              margin-bottom:3px;
            ">
              ${
                winner === "Player A"
                  ? '<i class="fas fa-trophy tropyAnimation"></i>'
                  : ""
              }
              ${playerACardsP}
            </div>
          `
          : `
            <div style="
              display:flex;
              justify-content:center;
              align-items:center;
              margin-bottom:3px;
            ">
              ${poisonCards}
              ${
                winner === "Player A"
                  ? '<i class="fas fa-trophy tropyAnimation"></i>'
                  : ""
              }
            </div>
          `
      }

      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        ${istwocard ? "Player B": `Player B (${totalB})`}
      </div>

      ${
        istwocard
          ? `
            <div style="
              display:flex;
              justify-content:center;
              align-items:center;
              margin-bottom:3px;
            ">
              ${
                winner === "Player B"
                  ? '<i class="fas fa-trophy tropyAnimation"></i>'
                  : ""
              }
              ${playerBCardsP}
            </div>
          `
          : `
            <div style="
              display:flex;
              justify-content:center;
              align-items:center;
              margin-bottom:3px;
            ">
              ${playerACardsp}
              ${
                winner === "Player B"
                  ? '<i class="fas fa-trophy tropyAnimation"></i>'
                  : ""
              }
            </div>
          `
      }

    </div>

    <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
    ">

      <div style="
        display:flex;
        justify-content:center;
        font-size:12px;
        margin-bottom:2px;
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
          Main
        </span>

        <span style="width:60%">
          ${winner}
        </span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        font-size:12px;
        margin-bottom:2px;
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
          Seven
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>

      <div style="
        display:flex;
        justify-content:center;
        font-size:12px;
        margin-bottom:2px;
      ">
        <span style="
          opacity:0.6;
          margin-right:8px;
          width:30%;
          text-align:end;
        ">
          Picture Card
        </span>

        <span style="width:60%">
          ${consecutiveData}
        </span>
      </div>

    </div>
  `;
};

export default TrapResult;
