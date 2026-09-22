import React from "react";

interface PokerSixResultProps {
  resultHtml: any;
}

const PokerSixResult = ({
  resultHtml,
}: PokerSixResultProps) => {


  const cards = resultHtml.card?.split(",") || [];
  const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");
  const board = cards.slice(0,5);
  const playerA = cards.slice(5,7);
  const playerB = cards.slice(7,9);
  const playerC = cards.slice(9,11);
  const playerD = cards.slice(11,13);
  const playerE = cards.slice(13,15);
  const playerF = cards.slice(15,17);


  
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
  const playerACards = createCards(playerA)
  const playerBCards = createCards(playerB);
  const playerCCards = createCards(playerC)
  const playerDCards = createCards(playerD);
  const playerECards = createCards(playerE)
  const playerFCards = createCards(playerF);
  const boardCard = createCards(board);

  return `
    <div style="text-align:center;">
 <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
       Board
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
   
        ${boardCard}    ${
        winner === "Board"
          ? '<i class="fas fa-trophy tropyAnimation"></i>'
          : ""
      }
      </div>
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        1
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
     
        ${playerACards} ${
          winner === "Player 1"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        6
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerBCards} ${
          winner === "Player 6"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        2
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerCCards} ${
          winner === "Player 2"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>
      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        5
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerDCards} ${
          winner === "Player 5"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>


      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        3
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerECards} ${
          winner === "Player 3"
            ? '<i class="fas fa-trophy tropyAnimation"></i>'
            : ""
        }
      </div>

      <div style="
        font-size:16px;
        margin-bottom:3px;
      ">
        
        4
      </div>

      <div style="
        display:flex;
        justify-content:center;
        align-items:center;
      ">
     
        ${playerFCards} ${
          winner === "Player 4"
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
         Pattern
        </span>

        <span style="width:60%">
          ${oddEvenData}
        </span>
      </div>
   
    </div>
  `;
};

export default PokerSixResult;