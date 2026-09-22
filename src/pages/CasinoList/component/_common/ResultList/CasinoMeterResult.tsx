import React from "react";

interface CasinoMeterResultProps {
  resultHtml: any;
}

const CasinoMeterResult = ({
  resultHtml,
}: CasinoMeterResultProps) => {

  const cards = resultHtml?.card?.split(",") || [];

  const winner = resultHtml?.winnat || "";
  const rdesc = resultHtml?.rdesc || "";

  // First 7 cards = Low Cards
  const lowCards = cards.slice(0, 7);

  // Remaining cards = High Cards
  const highCards = cards.slice(7, 11);

  const createCards = (cardList: string[]) => {
    return cardList
      .map((card: string) => {

        const safeCard = card
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, "");

        if (!safeCard) return "";

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

  const lowCardsHtml = createCards(lowCards);
  const highCardsHtml = createCards(highCards);

  return `
    <div style="text-align:center;">

      <!-- LOW CARDS -->
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        margin-bottom:5px;
      ">

        <div style="
          font-size:12px;
          width:15%;
          padding:0 1px;
          text-align:center;
        ">
          Low<br/>
          Cards
        </div>

        <div style="
          display:flex;
          justify-content:center;
          align-items:center;
          width:80%;
          padding:0 10px;
        ">

      

          ${lowCardsHtml}

        </div>

      </div>


      <!-- HIGH CARDS -->
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        margin-bottom:5px;
      ">

        <div style="
          font-size:12px;
          width:15%;
          padding:0 1px;
          text-align:center;
        ">
          High<br/>
          Cards
        </div>

        <div style="
          display:flex;
          justify-content:center;
          align-items:center;
          width:80%;
          padding:0 10px;
        ">

       

          ${highCardsHtml}

        </div>

      </div>

    </div>


    <!-- RESULT -->
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

        <span style="width:60%;">
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
          Result
        </span>

        <span style="width:60%;">
          ${rdesc}
        </span>

      </div>

    </div>
  `;
};

export default CasinoMeterResult;