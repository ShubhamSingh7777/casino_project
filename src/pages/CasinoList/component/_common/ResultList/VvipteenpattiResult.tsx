
import React from "react";

interface VvipteenpattiResultProps {
  resultHtml: any;
}

const VvipteenpattiResult = ({
  resultHtml,
}: VvipteenpattiResultProps) => {
  const cards = resultHtml.card?.split(",") || [];

  const winnat = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  const winner = rdescParts[0]?.trim() || "";
  const oddEvenData = rdescParts[2]?.trim() || "";
  const suitData = rdescParts[1]?.trim() || "";
  const luckyData = rdescParts[3]?.trim() || "";

  // Alternate cards:
  // Card 1 -> Player A
  // Card 2 -> Player B
  // Card 3 -> Player A
  // Card 4 -> Player B
  // Card 5 -> Player A
  // Card 6 -> Player B

  const playerACards = cards.filter(
    (_: string, index: number) => index % 2 === 0
  );

  const playerBCards = cards.filter(
    (_: string, index: number) => index % 2 !== 0
  );

  const createCards = (playerCards: string[]) => {
    return playerCards
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

  const playerACardHtml = createCards(playerACards);
  const playerBCardHtml = createCards(playerBCards);

  return `
    <div style="text-align:center;">

      <!-- Player A -->
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        Player A
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:8px;
      ">
        ${playerACardHtml}

        ${
          winner === "Player A"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>


      <!-- Player B -->
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        Player B
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
        ${playerBCardHtml}

        ${
          winner === "Player B" || winner === "B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

    </div>


    <!-- Result Details -->
    <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:6px 35px;
    ">

      <!-- Winner -->
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
          Winner
        </span>

        <span style="width:60%">
          ${winner}
        </span>
      </div>


      <!-- Odd / Even -->
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
          Odd/Even
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>


      <!-- Suit -->
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
          Consecutive:
        </span>

        <span style="width:60%">
          ${luckyData}
        </span>
      </div>

    </div>
  `;
};

export default VvipteenpattiResult;
