import React from "react";
import { isMobile } from "react-device-detect";

interface SuperOverResultProps {
  resultHtml: any;
}

const SuperOverResult = ({ resultHtml }: SuperOverResultProps) => {
  // Actual API structure:
  // resultHtml.data.html
  const result = resultHtml;

  const scoreData = result?.score || [];

  const winner = result?.winnat || "";
  const rdesc = result?.rdesc || "";

  console.log("SUPER OVER RESULT:", winner);
  console.log("SUPER OVER SCORE:", scoreData);

  // -------------------------
  // INNING 1
  // -------------------------

  const innings1 = scoreData.filter((item: any) => Number(item.ing) === 1);

  // -------------------------
  // INNING 2
  // -------------------------

  const innings2 = scoreData.filter((item: any) => Number(item.ing) === 2);

  // -------------------------
  // RUNS
  // -------------------------

  const totalRuns1 = innings1.reduce(
    (sum: number, item: any) => sum + Number(item.run || 0),
    0,
  );

  const totalRuns2 = innings2.reduce(
    (sum: number, item: any) => sum + Number(item.run || 0),
    0,
  );

  // -------------------------
  // WICKETS
  // -------------------------

  const wickets1 = innings1.filter((item: any) => item.wkt === true).length;

  const wickets2 = innings2.filter((item: any) => item.wkt === true).length;

  // -------------------------
  // CREATE CARD IMAGES
  // -------------------------

  const createCards = (balls: any[]) => {
    return balls
      .map((ball: any) => {
        const safeCard = String(ball.card || "").replace(/[^a-zA-Z0-9_-]/g, "");

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

  // -------------------------
  // CREATE BALLS
  // -------------------------

  const createBalls = (balls: any[]) => {
    const columnWidth = 100 / (balls.length + 3);
    return balls
      .map(
        (ball: any) => `
          <td style=" width:${columnWidth}%;padding:${!isMobile?'0.3rem 6px':''};font-size:${isMobile?'12px':'16px'};color:#333">
            ${
              ball.wkt
                ? '<span class="wicket">WW</span>'
                : Number(ball.run || 0)
            }
          </td>
        `,
      )
      .join("");
  };

  const innings1Cards = createCards(innings1);
  const innings2Cards = createCards(innings2);

  const innings1Balls = createBalls(innings1);
  const innings2Balls = createBalls(innings2);

  // -------------------------
  // RETURN HTML STRING
  // -------------------------

  return `
    <div>

      <!-- WINNER -->
      <div style="background-color: #2c3e50d9;display:flex;padding:${isMobile?'10px':'14px'};justify-content:end;align-items:end">
      <div
        style="
          text-align:center;
       font-size:${!isMobile ? "16px" : "12px"};
          font-weight:400;
          margin-bottom:0px;
          color: white;
        "
      >
        Winner :
        <span style="color:#fdcf13">${winner}</span>
     </div>   
     <div style="color:white;padding:0px 2px">|</div>
        <div
          style="
             font-size:${!isMobile ? "16px" : "12px"};
            font-weight:400;
            margin-top:0px;
              color: white
          "
        >
          ${rdesc} 
        </div>
  
      </div>


      <!-- FIRST INNING -->
      <div
        style="
       
          border-top:1px solid #ddd;
          margin-top:10px;
          padding:0px;
        "
      >

        <div
          style="
            text-align:start;
            font-size:${isMobile?'16px':'20px'};
            font-weight:400;
            margin-bottom:0px;
            background-color:#0088cce6;
            padding:5px;
            color:white
          "
        >
          First Inning
        </div>

        <table
          class="table score-table"
          style="
            width:100%;
  text-align:center;
  table-layout:fixed;
          "
        >

          <thead>
            <tr>

              <th style="  width:${100 / (innings1.length + 3)}%;font-size:${isMobile?'12px':'16px'};text-align:${!isMobile?'start':''};color:#333;padding:${!isMobile?'0.3rem 6px':'0px'}">
                ${innings1[0]?.nat || ""}
              </th>

              ${innings1
                .map(
                  (_: any, index: number) =>
                    `<th style=" width:${100 / (innings1.length + 3)}%;font-size:${isMobile?'12px':'16px'};padding:${!isMobile?'0.3rem 6px':'0px'};color:#333">${index + 1}</th>`,
                )
                .join("")}

              <th style="width:${100 / (innings1.length + 3)}%;font-size:${isMobile?'12px':'16px'};color:#333;padding:${!isMobile?'0.3rem 6px':'0px'}">Run/Over</th>

              <th style="width:${100 / (innings1.length + 3)}%;font-size:${isMobile?'12px':'16px'};color:#333;padding:${!isMobile?'0.3rem 6px':'0px'}">Score</th>

            </tr>
          </thead>

          <tbody>

            <tr>

              <td style="font-size:${isMobile?'12px':'16px'};text-align:${!isMobile?'start':''};color:#333;padding:${!isMobile?'0.3rem 6px':'0px'}">Over 1</td>

              ${innings1Balls}

              <td style="padding:${!isMobile?'0.3rem 6px':'0px'};font-size:${isMobile?'12px':'16px'};color:#333;vertical-align:middle">
                ${totalRuns1}
              </td>

              <td style="font-size:${isMobile?'12px':'16px'};padding:${!isMobile?'0.3rem 6px':'0px'};color:#333;vertical-align:middle">
                ${totalRuns1}/${wickets1}
              </td>

            </tr>

          </tbody>

        </table>

      </div>


      <!-- SECOND INNING -->
      <div
        style="
       
          border-top:1px solid #ddd;
          margin-top:${isMobile?'10px':'8px'};
          padding:0px;
        "
      >

        <div
          style="
            text-align:start;
          font-size:${isMobile?'16px':'20px'};
            font-weight:400;
            margin-bottom:0px;
            background-color:#0088cce6;
            padding:${isMobile?'5px':'8px 5px'};
            color:white
          "
        >
          Second Inning
        </div>

        <table
          class="table score-table"
          style="
            width:100%;
            text-align:center;
          "
        >

          <thead>
            <tr>

              <th style="font-size:${isMobile?'12px':'16px'};text-align:${!isMobile?'start':''};color:#333;padding:${!isMobile?'0.3rem 6px':'0px'}">
                ${innings2[0]?.nat || ""}
              </th>

              ${innings2
                .map(
                  (_: any, index: number) =>
                    `<th style="font-size:${isMobile?'12px':'16px'};padding:${!isMobile?'0.3rem 6px':'0px'};color:#333">${index + 1}</th>`,
                )
                .join("")}

              <th style="padding:${!isMobile?'0.3rem 6px':'0px'};font-size:${isMobile?'12px':'16px'};color:#333">Run/Over</th>

              <th style="font-size:${isMobile?'12px':'16px'};padding:${!isMobile?'0.3rem 6px':'0px'};color:#333">Score</th>

            </tr>
          </thead>

          <tbody>

            <tr>

              <td style="font-size:${isMobile?'12px':'16px'};text-align:${!isMobile?'start':''};color:#333;padding:${!isMobile?'0.3rem 6px':'0px'}">Over 1</td>

              ${innings2Balls}

              <td style="font-size:${isMobile?'12px':'16px'};padding:${!isMobile?'0.3rem 6px':'0px'};color:#333;vertical-align:middle">
                ${totalRuns2}
              </td>

              <td style="font-size:${isMobile?'12px':'16px'};padding:${!isMobile?'0.3rem 6px':'0px'};color:#333;vertical-align:middle">
                ${totalRuns2}/${wickets2}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  `;
};

export default SuperOverResult;
