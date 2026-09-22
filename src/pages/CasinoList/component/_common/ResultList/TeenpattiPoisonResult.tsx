import React from "react";

interface TeenpattiPoisonResultProps {
  resultHtml: any;
}

const TeenpattiPoisonResult = ({
  resultHtml,
}: TeenpattiPoisonResultProps) => {
    const isjoker = resultHtml.ename === "Unlimited Joker 20-20" || resultHtml.ename === "Teenpatti Joker 20-20" || resultHtml.ename === "Unlimited Joker Oneday";
   
  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const poison = cards.slice(0,1);
  
  const playerAP = cards.slice(1, 4);
  const playerBP = cards.slice(4, 7);
   const suitData = rdescParts[3]?.trim() || "";
          const oddEvenData = rdescParts[1]?.trim() || "";
          const consecutiveData = rdescParts[2]?.trim() || "";

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
  const poisonCards = createCards(poison)
  const playerACardsp = createCards(playerAP);
  const playerBCardsP = createCards(playerBP);

  return `
    <div style="text-align:center;">
 <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
       ${isjoker ? `joker`:`Posion`}
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
       ${
        winner === "Poison"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
        ${poisonCards}
      </div>
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
        margin-bottom:3px;
      ">
      ${
          winner === "Player A"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${playerACardsp}
      </div>

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
      ">
      ${
          winner === "Player B"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
        ${playerBCardsP}
      </div>

    </div>
${!isjoker ?`  <div style="
      box-shadow:0 0 4px -1px;
      border-top:1px solid #ddd;
      margin-top:15px;
      padding:12px 35px;
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
          Winner
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
          Odd/Even
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
          Color
        </span>

        <span style="width:60%">
          ${consecutiveData}
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
          Suit
        </span>

        <span style="width:60%">
          ${suitData}
        </span>
      </div>
    `:''}
  


    </div>
  `;
};

export default TeenpattiPoisonResult;