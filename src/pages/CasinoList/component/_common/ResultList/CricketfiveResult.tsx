import React from "react";
import { isMobile } from "react-device-detect";

interface CricketFiveResultProps {
  resultHtml: any;
}

const CricketFiveResult = ({ resultHtml }: CricketFiveResultProps) => {
  const result = resultHtml;

  const scoreData = result?.score || [];

  const winner = result?.winnat || "";
  const rdesc = result?.rdesc || "";

  // --------------------------------
  // INNINGS
  // --------------------------------

  const innings1 = scoreData.filter(
    (item: any) => Number(item.ing) === 1,
  );

  const innings2 = scoreData.filter(
    (item: any) => Number(item.ing) === 2,
  );

  // --------------------------------
  // GROUP BALLS BY OVER
  // API uses "oc" for over number
  // --------------------------------

  const groupByOver = (balls: any[]) => {
    const grouped: Record<number, any[]> = {};

    balls.forEach((ball: any) => {
      const overNumber = Number(ball.oc);

      if (!grouped[overNumber]) {
        grouped[overNumber] = [];
      }

      grouped[overNumber].push(ball);
    });

    return Object.keys(grouped)
      .sort((a, b) => Number(a) - Number(b))
      .map((over) => ({
        over: Number(over),
        balls: grouped[Number(over)],
      }));
  };

  const innings1Overs = groupByOver(innings1);
  const innings2Overs = groupByOver(innings2);

  // --------------------------------
  // CREATE INNING TABLE
  // --------------------------------

  const createInningTable = (
    innings: any[],
    overs: any[],
    title: string,
  ) => {
    const teamName = innings?.[0]?.nat || "";

    let cumulativeRuns = 0;
    let cumulativeWickets = 0;

    return `
      <div
        style="
          border-top:1px solid #ddd;
          margin-top:${isMobile ? "10px" : "8px"};
          padding:0;
          width:100%;
        "
      >

        <!-- INNING TITLE -->

        <div
          style="
            background-color:#0088cce6;
            color:white;
            font-size:${isMobile ? "16px" : "20px"};
            font-weight:400;
            padding:${isMobile ? "6px 10px" : "8px 10px"};
            text-align:left;
          "
        >
          ${title}
        </div>


        <!-- TABLE -->

        <table
          style="
            width:100%;
            table-layout:fixed;
            border-collapse:collapse;
            text-align:center;
            margin:0;
          "
        >

          <!-- HEADER -->

          <thead>

            <tr>

              <th
                style="
                  width:18%;
                  font-size:${isMobile ? "12px" : "16px"};
                  font-weight:600;
                  color:#333;
                  text-align:left;
                  padding:${isMobile ? "7px 6px" : "9px 10px"};
                  border-bottom:1px solid #ccc;
                  white-space:nowrap;
                "
              >
                ${teamName}
              </th>


              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                "
              >
                1
              </th>

              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                "
              >
                2
              </th>

              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                "
              >
                3
              </th>

              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                "
              >
                4
              </th>

              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                "
              >
                5
              </th>

              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                "
              >
                6
              </th>


              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                  white-space:nowrap;
                "
              >
                Run/Over
              </th>


              <th
                style="
                  font-size:${isMobile ? "12px" : "16px"};
                  color:#333;
                  padding:7px 2px;
                  border-bottom:1px solid #ccc;
                  white-space:nowrap;
                "
              >
                Score
              </th>

            </tr>

          </thead>


          <!-- BODY -->

          <tbody>

            ${overs
              .map((overData: any) => {
                let overRuns = 0;
                let overWickets = 0;

                const balls = overData.balls || [];

                /*
                 * Always create exactly 6 ball columns.
                 */

                const ballCells = [0, 1, 2, 3, 4, 5]
                  .map((index) => {
                    const ball = balls[index];

                    /*
                     * If ball does not exist,
                     * keep empty cell.
                     */

                    if (!ball) {
                      return `
                        <td
                          style="
                            font-size:${isMobile ? "12px" : "16px"};
                            color:#333;
                            padding:${isMobile ? "7px 2px" : "9px 4px"};
                            border-bottom:1px solid #ccc;
                          "
                        >
                        </td>
                      `;
                    }

                    const runs = Number(ball.run || 0);

                    overRuns += runs;

                    if (ball.wkt === true) {
                      overWickets++;
                    }

                    return `
                      <td
                        style="
                          font-size:${isMobile ? "12px" : "16px"};
                          color:#333;
                          padding:${isMobile ? "7px 2px" : "9px 4px"};
                          border-bottom:1px solid #ccc;
                          text-align:center;
                          vertical-align:middle;
                        "
                      >
                        ${
                          ball.wkt === true
                            ? `
                              <span
                                style="
                                  color:red;
                                  font-weight:500;
                                "
                              >
                                WW
                              </span>
                            `
                            : runs
                        }
                      </td>
                    `;
                  })
                  .join("");

                /*
                 * CUMULATIVE SCORE
                 */

                cumulativeRuns += overRuns;
                cumulativeWickets += overWickets;

                return `
                  <tr>

                    <!-- OVER -->

                    <td
                      style="
                        font-size:${isMobile ? "12px" : "16px"};
                        color:#333;
                        padding:${isMobile ? "7px 6px" : "9px 10px"};
                        text-align:left;
                        border-bottom:1px solid #ccc;
                        white-space:nowrap;
                      "
                    >
                      Over ${overData.over}
                    </td>


                    <!-- BALLS -->

                    ${ballCells}


                    <!-- RUN / OVER -->

                    <td
                      style="
                        font-size:${isMobile ? "12px" : "16px"};
                        color:#333;
                        padding:${isMobile ? "7px 2px" : "9px 4px"};
                        border-bottom:1px solid #ccc;
                        text-align:center;
                        vertical-align:middle;
                      "
                    >
                      ${cumulativeRuns}
                    </td>


                    <!-- SCORE -->

                    <td
                      style="
                        font-size:${isMobile ? "12px" : "16px"};
                        color:#333;
                        padding:${isMobile ? "7px 2px" : "9px 4px"};
                        border-bottom:1px solid #ccc;
                        text-align:center;
                        vertical-align:middle;
                        white-space:nowrap;
                      "
                    >
                      ${cumulativeRuns}/${cumulativeWickets}
                    </td>

                  </tr>
                `;
              })
              .join("")}

          </tbody>

        </table>

      </div>
    `;
  };

  // --------------------------------
  // MATCH TIME
  // --------------------------------

  const matchTime =
    result?.matchTime ||
    result?.matchtime ||
    result?.stime ||
    "";

  // --------------------------------
  // RETURN
  // --------------------------------

  return `
    <div
      style="
        width:100%;
        background:#fff;
        overflow:hidden;
      "
    >

      <!-- HEADER -->

  




      <!-- WINNER -->

      <div
        style="
          background-color:#4b5e6d;
          display:flex;
          justify-content:flex-end;
          align-items:center;
          padding:${isMobile ? "10px 8px" : "14px 10px"};
          color:white;
          font-size:${isMobile ? "13px" : "18px"};
        "
      >

        <span>
          Winner :
        </span>

        <span
          style="
            color:#fdcf13;
            margin-left:4px;
          "
        >
          ${winner}
        </span>

        <span
          style="
            color:white;
            margin:0 4px;
          "
        >
          |
        </span>

        <span>
          ${rdesc}
        </span>

      </div>


      <!-- FIRST INNING -->

      ${createInningTable(
        innings1,
        innings1Overs,
        "First Inning",
      )}


      <!-- SECOND INNING -->

      ${createInningTable(
        innings2,
        innings2Overs,
        "Second Inning",
      )}

    </div>
  `;
};

export default CricketFiveResult;