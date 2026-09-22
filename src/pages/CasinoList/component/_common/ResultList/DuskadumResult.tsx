import React from "react";

interface DuskadumResultProps {
  resultHtml: any;
}

const DuskadumResult = ({
  resultHtml,
}: DuskadumResultProps) => {
 const isbacc2 = resultHtml.ename === "Baccarat 2"

  const cards = resultHtml.card?.split(",") || [];
//   const winner = resultHtml.winnat || "";

  const rdesc = resultHtml.rdesc || "";
  const rdescParts = rdesc.split("#");

  const allcards = cards.slice(0,26)
  const lastCard = cards.slice(26,27)

  const card =  rdescParts[0]?.trim() || "";
          const winnerpair = rdescParts[1]?.trim() || "";
          const perfect = rdescParts[2]?.trim() || "";
          const either = rdescParts[3]?.trim() || "";
          const bigsmall = rdescParts[4]?.trim() || "";


const createCardsBacc = (cards: string[],isLastCard = false) => {
  return cards
    .map((card: string) => {
      const safeCard = card.replace(/[^a-zA-Z0-9_-]/g, "");
      
      return `
        <div style="
          width:62px;
          height:auto;
          display:flex;
          justify-content:center;
          align-items:center;
          flex-shrink:0;
          box-sizing:border-box;
        ">
          <img
            src="https://g1ver.sprintstaticdata.com/v73/static/front/img/cards/${safeCard}.jpg"
            alt="${safeCard}"
            style="
              width:${isLastCard ? "35px" : "40px"};;
              height:${isLastCard ? "35px" : "50px"};
              max-width:72px;
              object-fit:contain;
            "
          />
        </div>
      `;
    })
    .join("");
};

const allCards = createCardsBacc(allcards);
const lastCardHtml = createCardsBacc(lastCard);

console.log("Total cards:", cards.length);
const sliderId = `duskadumCards_${Date.now()}`;
  
// const player2Card = createCardsBacc2(player2);
// const banker2Card = createCardsBacc2(banker2);

return `
  <div style="text-align:center;">

    <!-- 32 CARDS SLIDER -->
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      width:100%;
      margin:4px auto;
      gap:0px;
    ">

      <!-- LEFT ARROW -->
      <button
        onclick="
          document.getElementById('${sliderId}').scrollBy({
            left:-250,
            behavior:'smooth'
          })
        "
        style="
          width:20px;
          height:20px;
          min-width:20px;
          border:none;
          border-radius:50%;
          background:#333;
          color:#fff;
          font-size:26px;
          cursor:pointer;
          font-weight:bold;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0px 6px 7px;
          z-index:2;
        "
      >
        ‹
      </button>

      <!-- FIRST 32 CARDS -->
      <div
        id="${sliderId}"
        style="
          display:flex;
          align-items:center;
          gap:2px;
          overflow:hidden;
          width:450px;
          scroll-behavior:smooth;
          padding:5px;
          box-sizing:border-box;
        "
      >
        ${allCards}
      </div>

      <!-- RIGHT ARROW -->
      <button
        onclick="
          document.getElementById('${sliderId}').scrollBy({
            left:250,
            behavior:'smooth'
          })
        "
        style="
          width:20px;
          height:20px;
          min-width:20px;
          border:none;
          border-radius:50%;
          background:#333;
          color:#fff;
          font-size:26px;
          font-weight:bold;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:0px 6px 7px;
        "
      >
        ›
      </button>

    </div>

    <!-- ONLY LAST CARD -->
     <div style="
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:3px;
      ">
  
        ${lastCardHtml}   
      </div>


    <!-- RESULT DETAILS -->
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
          Card
        </span>

        <span style="width:60%;text-align:start">
          ${card}
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
          Curr. Total
        </span>

        <span style="width:60%;text-align:start">
          ${winnerpair}
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
          Total
        </span>

        <span style="width:60%;text-align:start">
          ${perfect}
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

        <span style="width:60%;text-align:start">
          ${either}
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
          Red/Black
        </span>

        <span style="width:60%;text-align:start">
          ${bigsmall}
        </span>
      </div>

    </div>

  </div>
`;
}
export default DuskadumResult;