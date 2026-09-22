import React from "react";

interface Race20ResultProps {
  resultHtml: any;
}

const Race20Result = ({ resultHtml }: Race20ResultProps) => {
  const cards = resultHtml.card?.split(",") || [];

  const winner = resultHtml.winnat || "";
  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  const points = rdescParts[1]?.trim() || "";
  const total = rdescParts[2]?.trim() || "";

  // -------------------------------
  // Actual cards
  // -------------------------------
  const actualCards = cards.filter((card: string) => card !== "1");

  // -------------------------------
  // Group cards by suit
  // -------------------------------
  const spades = actualCards.filter((card: string) =>
    card.endsWith("SS")
  );

  const hearts = actualCards.filter((card: string) =>
    card.endsWith("HH")
  );

  const clubs = actualCards.filter((card: string) =>
    card.endsWith("CC")
  );

  const diamonds = actualCards.filter((card: string) =>
    card.endsWith("DD")
  );

  // -------------------------------
  // Make exactly 5 cards
  // -------------------------------
  const fillCards = (suitCards: string[]) => {
    const result = [...suitCards];

    while (result.length < 5) {
      result.push("1");
    }

    return result.slice(0, 5);
  };

  const spadeCards = fillCards(spades);
  const heartCards = fillCards(hearts);
  const clubCards = fillCards(clubs);
  const diamondCards = fillCards(diamonds);

  // -------------------------------
  // Create cards HTML
  // -------------------------------
  const createCards = (playerCards: string[]) => {
    return playerCards
      .map((card: string, index: number) => {
        const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");

        return `
          <img
            key="${safeCard}-${index}"
            src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
            alt="${safeCard}"
            style="
              width:auto;
              height:35px;
              object-fit:contain;
              margin:2px;
            "
          />
        `;
      })
      .join("");
  };

  const spadeHtml = createCards(spadeCards);
  const heartHtml = createCards(heartCards);
  const clubHtml = createCards(clubCards);
  const diamondHtml = createCards(diamondCards);

  // -------------------------------
  // Convert winner name to card code
  // Example: K Diamond -> KDD
  // -------------------------------
  const getWinnerCard = () => {
    const parts = winner.split(" ");

    if (parts.length < 2) return "";

    const rank = parts[0];
    const suit = parts.slice(1).join(" ").toLowerCase();

    let suitCode = "";

    if (suit === "diamond") {
      suitCode = "DD";
    } else if (suit === "heart") {
      suitCode = "HH";
    } else if (suit === "club") {
      suitCode = "CC";
    } else if (suit === "spade") {
      suitCode = "SS";
    }

    return `${rank}${suitCode}`;
  };

  const winnerCard = getWinnerCard();

  const winnerCardHtml = winnerCard
    ? `
      <img
        src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${winnerCard}.jpg"
        alt="${winnerCard}"
        style="
          width:auto;
          height:35px;
          object-fit:contain;
          margin-left:8px;
        "
      />
    `
    : "";

  return `
    <div
      style="
        display:flex;
        justify-content:start;
        align-items:end;
        width:100%;
        overflow:hidden;
      "
    >

      <!-- SUIT SECTION -->
      <div>

        <!-- SPADE -->
        <div
          style="
            display:flex;
            align-items:center;
            height:40px;
          "
        >
          <div
            style="
              width:37px;
              text-align:center;
              font-size:43px;
              color:#111;
              line-height:1;
            "
          >
            <img src='/spade.png' alt='' style="width:auto;height:35px">
          </div>

          <div
            style="
              display:flex;
              align-items:center;
              white-space:nowrap;
            "
          >
            ${spadeHtml}
          </div>
        </div>

        <!-- HEART -->
        <div
          style="
            display:flex;
            align-items:center;
            height:40px;
          "
        >
          <div
            style="
              width:37px;
              text-align:center;
              font-size:43px;
              color:#e60000;
              line-height:1;
            "
          >
            <img src='/heart.png' alt='' style="width:auto;height:35px">
          </div>

          <div
            style="
              display:flex;
              align-items:center;
              white-space:nowrap;
            "
          >
            ${heartHtml}
          </div>
        </div>

        <!-- CLUB -->
        <div
          style="
            display:flex;
            align-items:center;
            height:40px;
          "
        >
          <div
            style="
              width:37px;
              text-align:center;
              font-size:43px;
              color:#111;
              line-height:1;
            "
          >
            <img src='/club.png' alt='' style="width:auto;height:35px">
          </div>

          <div
            style="
              display:flex;
              align-items:center;
              white-space:nowrap;
            "
          >
            ${clubHtml}
          </div>
        </div>

        <!-- DIAMOND -->
        <div
          style="
            display:flex;
            align-items:center;
            height:40px;
          "
        >
          <div
            style="
              width:37px;
              text-align:center;
              font-size:43px;
              color:#e60000;
              line-height:1;
            "
          >
            <img src='/diamond.png' alt='' style="width:auto;height:35px">
          </div>

          <div
            style="
              display:flex;
              align-items:center;
              white-space:nowrap;
            "
          >
            ${diamondHtml}
          </div>
        </div>

      </div>


      <!-- WINNER -->
      <div
        style="
        color: #097c93;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    font-size: 16px;
    width: 30px;
    height: 23vh;
    border: 1px solid #097c93;
    padding: 2px 12px;
    background-color: var(--bg-body);
    z-index: 100;
        "
      >
        <div>
          W
        </div>
        <div>I</div>
          <div>
          N
        </div>
        <div>N</div>
          <div>
          E
        </div>
        <div>R</div>
      </div>


      <!-- WINNER CARD + TROPHY -->
      <div
        style="
          display:flex;
          align-items:center;
          margin-left:8px;
        "
      >
        ${winnerCardHtml}

        <i
          class="fas fa-trophy tropyAnimation"
          style="
            font-size:26px;
            color:#169447;
            margin-left:4px;
          "
        ></i>
      </div>

    </div>


    <!-- RESULT DETAILS -->
    <div
      style="
        box-shadow:0 0 4px -1px;
        border-top:1px solid #ddd;
        margin-top:15px;
        padding:6px 35px;
      "
    >

      <div
        style="
          display:flex;
          justify-content:center;
          font-size:12px;
          margin-bottom:2px;
        "
      >
        <span
          style="
            opacity:0.6;
            margin-right:8px;
            width:30%;
            text-align:end;
          "
        >
          Winner
        </span>

        <span style="width:60%">
          ${winner}
        </span>
      </div>


      <div
        style="
          display:flex;
          justify-content:center;
          font-size:12px;
          margin-bottom:2px;
        "
      >
        <span
          style="
            opacity:0.6;
            margin-right:8px;
            width:30%;
            text-align:end;
          "
        >
          Points
        </span>

        <span style="width:60%">
          ${points}
        </span>
      </div>


      <div
        style="
          display:flex;
          justify-content:center;
          font-size:12px;
          margin-bottom:2px;
        "
      >
        <span
          style="
            opacity:0.6;
            margin-right:8px;
            width:30%;
            text-align:end;
          "
        >
          Total
        </span>

        <span style="width:60%">
          ${total}
        </span>
      </div>

    </div>
  `;
};

export default Race20Result;