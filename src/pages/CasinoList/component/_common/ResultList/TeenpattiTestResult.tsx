import React from "react";

interface TeenpattiTestResultProps {
  resultHtml: any;
}

const TeenpattiTestResult = ({
  resultHtml,
}: TeenpattiTestResultProps) => {

  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const poison = cards.slice(0,3);
  
  const playerAP = cards.slice(3, 6);
  const playerBP = cards.slice(6, 9);
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
       Tiger
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
   
        ${poisonCards}    ${
        winner === "Tiger"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        Lion
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerACardsp} ${
          winner === "Lion"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        Dragon
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerBCardsP} ${
          winner === "Dragon"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

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
          Other
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>


    </div>
  `;
};

export default TeenpattiTestResult;