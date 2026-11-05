import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import Worli3ButtonItem from "./_common/new/Worli3ButtonItem";


const leftMenu = [
    "Jodi",
    "Single",
    "Pana",
    "SP",
    "DP",
    "Trio",
    "Cycle",
    "Motor SP",
    "56 Charts",
    "64 Charts",
    "ABR",
    "Common SP",
    "Common DP",
    "Color DP",
];

/* ===================== DATA ===================== */

const spPanaData: Record<number, number[]> = {
    1: [128, 137, 146, 236, 245, 290, 380, 470, 489, 560, 579, 678],
    2: [129, 138, 147, 156, 237, 246, 345, 390, 480, 570, 589, 679],
    3: [120, 139, 148, 157, 238, 247, 256, 346, 490, 580, 670, 689],
    4: [130, 149, 158, 167, 239, 248, 257, 347, 356, 590, 660, 789],
    5: [140, 159, 168, 230, 249, 258, 267, 348, 357, 456, 690, 780],
    6: [123, 150, 169, 178, 240, 259, 268, 349, 358, 367, 457, 790],
    7: [124, 160, 179, 250, 269, 278, 340, 359, 467, 567, 680, 890],
    8: [125, 134, 170, 189, 260, 279, 350, 369, 468, 478, 567, 890],
    9: [126, 135, 180, 234, 270, 289, 360, 379, 450, 469, 566, 568],
    0: [127, 136, 145, 190, 235, 280, 370, 389, 460, 479, 578, 689],
};

const dpPanaData: Record<number, number[]> = {
    1: [100, 119, 155, 227, 335, 344, 399, 588, 669],
    2: [110, 200, 228, 255, 336, 499, 660, 668, 776],
    3: [166, 229, 300, 337, 355, 445, 598, 778, 786],
    4: [112, 220, 266, 336, 400, 446, 455, 689, 770],
    5: [113, 122, 177, 339, 366, 447, 500, 789, 889],
    6: [114, 277, 330, 448, 466, 555, 600, 860, 899],
    7: [115, 133, 188, 223, 377, 449, 557, 700, 799],
    8: [116, 224, 233, 266, 440, 477, 556, 880, 990],
    9: [117, 144, 199, 225, 388, 559, 577, 667, 900],
    0: [118, 226, 244, 299, 334, 488, 550, 666, 677],
};

const tpPanaData = ["777", "444", "111", "888", "555", "222", "999", "666", "333", "000"];

interface Worli3Props {
    markets: any[] | { data: any[] },
    selectedMarket: any | null
}

const Worli3: React.FC<Worli3Props> = ({ markets, selectedMarket }) => {
    const [activeMenu, setActiveMenu] = useState("Jodi");
    const [panaTab, setPanaTab] = useState<"SP" | "DP">("DP");
    const [totalAmount, setTotalAmount] = React.useState<number>(0);
    const [selectedNumbersByMenu, setSelectedNumbersByMenu] = useState<
        Record<string, Set<string | number>>
    >({})

    const coinAudio = React.useRef<HTMLAudioElement | null>(null);



    const getCoinValue = (chip: number | string): number => {
        if (chip === "1K") return 1000;
        return Number(chip);
    };
    const marketList = React.useMemo<any[]>(() => {
        if (Array.isArray(markets)) return markets
        if (Array.isArray((markets as any)?.data)) return (markets as any).data
        return []
    }, [markets])

    const openMarket = marketList.find(m => m.mtype === 'OPEN')

    const toggleNumber = (value: string | number) => {
        if (!totalAmount || totalAmount <= 0) return
        setSelectedNumbersByMenu(prev => {
            const currentSet = new Set(prev[activeMenu] ?? [])

            if (currentSet.has(value)) {
                currentSet.delete(value)
            } else {
                currentSet.add(value)
            }

            return {
                ...prev,
                [activeMenu]: currentSet,
            }
        })
    }
    const isSelected = (value: string | number) => {
        return selectedNumbersByMenu[activeMenu]?.has(value) ?? false
    }
    React.useEffect(() => {
        if (!totalAmount || totalAmount <= 0) {
            setSelectedNumbersByMenu({})
        }
    }, [totalAmount])
    // sound section
    React.useEffect(() => {
        coinAudio.current = new Audio("/sound/coin.mp3");
        coinAudio.current.volume = 0.5;
    }, []);

    const CoinButtons = (
        <div className="d-flex gap-2 ms-2 align-items-center">
            <div
                className="total d-flex align-items-center justify-content-center"
                style={{ ...coin, backgroundImage: "url('/imgs/coins/8.png')",width:isMobile ?'40px':'55px',height:isMobile ?'40px':'55px'}}
            >
                {totalAmount}
            </div>

            <div className="px-2 align-content-center">=</div>
               
            {/* {[25, 50, 100, 200, 500, "1K"].map((chip) => (
                <div
                    key={chip}
                    className="d-flex align-items-center justify-content-center"
                    style={{ ...coin, backgroundImage: "url('/imgs/coins/1.png')" }}
                    onClick={() => {
                        if (coinAudio.current) {
                            coinAudio.current.currentTime = 0;
                            coinAudio.current.play();
                        }
                        setTotalAmount((prev) => prev + getCoinValue(chip))
                    }}
                >
                    {chip}
                </div>
            ))} */}
            {[25, 50, 100, 200, 500, "1K"].map((chip, index) => (
    <React.Fragment key={chip}>
        {index > 0 && (
            <div className="px-1 align-content-center">+</div>
        )}

        <div
            className="d-flex align-items-center justify-content-center"
            style={{ ...coin, backgroundImage: "url('/imgs/coins/1.png')" }}
            onClick={() => {
                if (coinAudio.current) {
                    coinAudio.current.currentTime = 0;
                    coinAudio.current.play();
                }
                setTotalAmount((prev) => prev + getCoinValue(chip));
            }}
        >
            {chip}
        </div>
    </React.Fragment>
))}
        </div>
    );

    const isJodiSuspended = activeMenu === "Jodi" && selectedMarket?.mtype === "CLOSED"

    const renderButton = (
        label: string | number,
        prefix: string,
        boxStyle?: React.CSSProperties,
        customSelectionName?: string
    ) => (
        <div key={label} style={boxStyle}>
            <Worli3ButtonItem
                label={label}
                selectionName={customSelectionName ?? `${prefix},${label}`}
                market={selectedMarket}
                activeMenu={activeMenu}
                stake={totalAmount}
                isSelected={isSelected(customSelectionName ?? label)}
                onSelect={() => toggleNumber(customSelectionName ?? label)}
                isPana={["SP_PANA", "DP_PANA", "TP_PANA"].includes(prefix)}
                item={{
                    mid: openMarket?.mid,
                    mname: openMarket?.mname,
                    mtype: openMarket?.mtype ?? "CLOSED",
                }}
            />
        </div>
    )

    interface SingleSpecialButtonProps {
        label: string
        subtitle: string
        selectionName: string
        selectKey: string
    }
    const SingleSpecialButton: React.FC<SingleSpecialButtonProps> = ({
        label,
        subtitle,
        selectionName,
        selectKey,
    }) => {
        return (
            <div
                style={{
                    height: 70,
                    background: "#79c2f2",
                    border: "1px solid #fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Worli3ButtonItem
                    label={
                        <span style={{ fontFamily: "CasinoNumFont", fontSize: isMobile ?'1.2rem':'1.7rem' ,paddingBottom:".2rem" }}>
                            {label}
                        </span>
                    }
                    subtitle={subtitle}
                    selectionName={selectionName}
                    market={selectedMarket}
                    activeMenu={activeMenu}
                    stake={totalAmount}
                    isSelected={isSelected(selectKey)}
                    onSelect={() => toggleNumber(selectKey)}
                    item={{
                        mid: openMarket?.mid,
                        mname: openMarket?.mname,
                        mtype: openMarket?.mtype ?? "CLOSED",
                    }}
                />
            </div>
        )
    }

    return (
        <div className="container-fluid p-0" style={{marginTop: isMobile?'5px':''}}>
            {/* ================= TOP BAR ================= */}
            {isMobile ? (
                <div
                    className="d-flex flex-column align-items-center px-2 py-2"
                    style={{ background: "#d0d0d0", gap: ".4rem"}}
                >
                    <div className="d-flex" style={{ gap:isMobile ?'7px': '1rem' }}>
                        <button className="btn btn-sm rounded-0" onClick={() => setTotalAmount(0)} style={{background: "#bd1828",color:"#fff",fontSize: isMobile ? '11px':'',padding:isMobile ?"0rem .5rem":""}}>Reset</button>
                        <button className="btn rounded-0 btn-sm fw-bold" style={{ background: "#bebebe",padding: isMobile ?"4.5px 9px":"",fontSize: isMobile ? '11px':'',width: isMobile?'310px':''}}>
                            SET YOUR COIN AMOUNT AND START 1-CLICK BET!
                        </button>
                    </div>
                    {CoinButtons}
                </div>
            ) : (
                <div
                    className="d-flex align-items-center px-2 py-2"
                    style={{ background: "#cccccc", gap: ".4rem" }}
                >
                    <button className="btn rounded-0 btn-sm fw-bold" style={{ background: "#0000001a",fontSize:'12px' ,}}>
                        SET YOUR COIN AMOUNT <br /> AND START 1-CLICK BET!
                    </button>
                    <button className="btn btn-sm rounded-0"  style={{background: "#bd1828",color:"#fff",fontSize: isMobile ? '11px':'',padding:isMobile ?"0rem .5rem":".25rem .5rem"}} onClick={() => setTotalAmount(0)}>Reset</button>
                    {CoinButtons}
                </div>
            )}
            {/* ================= MAIN CONTENT ================= */}
            <div className="m-0 d-flex" style={{ width: "100%", gap: ".5%", paddingTop: ".3rem" }}>
                {/* LEFT MENU */}
                <div style={{ width:isMobile ? '24%' : '16%' }}>
                    {leftMenu.map((item) => (
                        <div
                            key={item}
                            onClick={() => setActiveMenu(item)}
                            style={{
                                width: "100%",
                                height: isMobile ? 'auto' : 'auto',
                                textAlign: "center",
                                fontSize: isMobile ? '14px' : '16px',
                                padding: isMobile ?'8px':'.5rem 1rem',
                                alignContent: "center",
                                cursor: "pointer",
                                margin:isMobile ?"1px":"",
                                background: activeMenu === item ? "#2c3e50" : "#cccccc",
                                color: activeMenu === item ? "#fff" : "#000",
                                borderBottom: "1px solid #070707",
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
                {/* RIGHT SIDE */}
                <div className={`${isJodiSuspended ? "suspended" : ""}`} style={{ width:isMobile ? "75%":"84%",marginLeft: isMobile ? "4px":"" }}>
                    {/* ================= JODI ================= */}
                    {activeMenu === "Jodi" && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile
                                    ? 'repeat(5, 1fr)'
                                    : 'repeat(10, 1fr)',
                                paddingTop: isMobile ? '4vh' : '6vh',
                                gap: "1px"
                            }}
                        >
                            {Array.from({ length: 100 }).map((_, i) => {
                                const row = Math.floor(i / 10)
                                const col = i % 10
                                const value = `${row}-${col}`
                                return (
                                    renderButton(value, "JODI", jodiBox)
                                )
                            })}
                        </div>
                    )}
                    {/* ================= SINGLE ================= */}
                    {activeMenu === "Single" && (
                        <>
                            {/* ===== ROW 1 ===== */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 12%) 1fr 1fr",
                                    paddingTop: isMobile ? "4vh" : "6vh",
                                    alignItems: "stretch",
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((n) => (
                                    renderButton(n, "SINGLE", singleBox)
                                ))}

                                {/* LINE 1 */}
                                <SingleSpecialButton
                                    label="LINE 1"
                                    subtitle="1|2|3|4|5"
                                    selectionName="SINGLE,LINE1"
                                    selectKey="LINE1"
                                />

                                {/* ODD */}
                                <SingleSpecialButton
                                    label="ODD"
                                    subtitle="1|3|5|7|9"
                                    selectionName="SINGLE,ODD"
                                    selectKey="ODD"
                                />
                            </div>
                            {/* ===== ROW 2 ===== */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 12%) 1fr 1fr",
                                    alignItems: "stretch",
                                }}
                            >
                                {[6, 7, 8, 9, 0].map((n) => (
                                    renderButton(n, "SINGLE", singleBox)
                                ))}
                                {/* line 2 */}
                                <SingleSpecialButton
                                    label="LINE 2"
                                    subtitle="6|7|8|9|0"
                                    selectionName="SINGLE,LINE2"
                                    selectKey="LINE2"
                                />
                                <SingleSpecialButton
                                    label="EVEN"
                                    subtitle="2|4|6|8|0"
                                    selectionName="SINGLE,EVEN"
                                    selectKey="EVEN"
                                />
                            </div>
                        </>
                    )}
                    {/* ================= PANA ================= */}
                    <div className="" style={{ width: "100%" }}>
                        {activeMenu === "Pana" && (
                            <>
                                {/* TABS */}
                                <div className="d-flex" style={{ height: isMobile ? '4vh' : "6vh" }}>
                                    <div
                                        onClick={() => setPanaTab("SP")}
                                        style={tabStyle(panaTab === "SP")}
                                    >
                                        SP PANA ()
                                    </div>
                                    <div
                                        onClick={() => setPanaTab("DP")}
                                        style={tabStyle(panaTab === "DP")}
                                    >
                                        DP PANA & TRIO ()
                                    </div>
                                </div>
                                {/* SP PANA */}
                                {panaTab === "SP" && (
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                                            width: "100%",
                                            gap: "1%",
                                        }}
                                    >
                                        {Object.entries(spPanaData).map(([d, list]) => (
                                            <div
                                                key={d}
                                                style={{
                                                    border: "1px solid #79c2f2",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    padding: "0px 6%"
                                                }}
                                            >
                                                <div className="mx-auto" style={panaHeader}>{d}</div>

                                                {list.map((v) => (
                                                    renderButton(v, "SP_PANA", panaBox, `PANA,SP_PANA,${v}`)
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* DP PANA */}
                                {panaTab === "DP" && (
                                    <>
                                        <div style={{ height: "2.5rem", alignContent: "center" }}>
                                            <span style={{ borderBottom: "2px solid #79c2f2", fontWeight: 800 }}>DP PANA</span>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                                                width: "100%",
                                                gap: "1%",
                                            }}>
                                            {Object.entries(dpPanaData).map(([d, list]) => (
                                                <div key={d}
                                                    style={{
                                                        border: "1px solid #79c2f2",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        padding: "0px 6%"
                                                    }}
                                                >
                                                    <div className="mx-auto" style={panaHeader}>{d}</div>
                                                    {list.map((v) => (
                                                        renderButton(v, "DP_PANA", tpBox, `PANA,DP_PANA,${v}`)
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        {/* TP PANA */}
                                        <div style={{ height: "3.5rem", alignContent: "center" }}>
                                            <span style={{ borderBottom: "2px solid #79c2f2", fontWeight: 800 }}>TP PANA</span>
                                        </div>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                                                width: "100%",
                                                gap: "4px",
                                            }}
                                        >
                                            {tpPanaData.map((v) => (
                                                renderButton(v, "TP_PANA", tpBox, `PANA,TP_PANA,${v}`)
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    {/* ================= SP ================= */}
                    {activeMenu === "SP" && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "70% 30%",
                                width: "100%",
                                paddingTop: isMobile ? "4vh" : "6vh",
                            }}
                        >
                            {/* ===== NUMBERS (LEFT) ===== */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                    renderButton(n, "SP", spBox)
                                ))}
                            </div>

                            {/* ===== SP ALL (RIGHT) ===== */}
                            {renderButton("SP ALL", "SP", All, "SP,SP ALL")}
                        </div>
                    )}
                    {/* ================= DP UI ================= */}
                    {activeMenu === "DP" && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "70% 30%",
                                width: "100%",
                                paddingTop: isMobile ? "4vh" : "6vh",
                            }}
                        >
                            {/* ===== NUMBERS (LEFT) ===== */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                    renderButton(n, "DP", spBox)
                                ))}
                            </div>

                            {/* ===== SP ALL (RIGHT) ===== */}
                            {renderButton("DP ALL", "DP", All, "DP,DP ALL")}
                        </div>
                    )}
                    {/* ================= Trio ================= */}
                    {activeMenu === 'Trio' && (
                        <div className="" style={{ width: "100%", height: isMobile ? '9vh' : "15vh", marginTop: isMobile ? '4vh' : "6vh" }}>
                            {renderButton("ALL TRIO", "ALL TRIO", All, "Trio,ALL TRIO")}
                        </div>
                    )}
                    {/* ================= Cycle ================= */}
                    {activeMenu === "Cycle" && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 1fr)",
                                marginTop: isMobile ? "4vh" : "6vh",
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                renderButton(n, "Cycle", spBox)
                            ))}
                        </div>
                    )}
                    {/* ================= Motor SP ================= */}
                    {activeMenu === 'Motor SP' && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 1fr)",
                                marginTop: isMobile ? "4vh" : "6vh",
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                renderButton(n, "Motor SP", spBox)
                            ))}
                        </div>
                    )}
                    {/* ================= 56 Charts ================= */}
                    {activeMenu === "56 Charts" && (
                        <div
                            style={{
                                width: "100%",
                                paddingTop: isMobile ? "4vh" : "6vh",
                                display: "grid",
                                gridTemplateColumns: "8fr 4fr",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) =>
                                    renderButton(n, "56 Charts", spBox)
                                )}
                            </div>
                            {/* 64 ALL */}
                            {renderButton("56 ALL", "56 Charts", All, "56 Charts,56 ALL")}
                        </div>
                    )}
                    {/* ================= 64 Charts ================= */}
                    {activeMenu === "64 Charts" && (
                        <div
                            style={{
                                width: "100%",
                                paddingTop: isMobile ? "4vh" : "6vh",
                                display: "grid",
                                gridTemplateColumns: "8fr 4fr",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) =>
                                    renderButton(n, "64 Charts", spBox)
                                )}
                            </div>
                            {/* 64 ALL */}
                            {renderButton("64 ALL", "64 Charts", All, "64 Charts,64 ALL")}
                        </div>
                    )}
                    {/* ================= ABR ================= */}
                    {activeMenu === "ABR" && (
                        <div
                            style={{
                                width: "100%",
                                paddingTop: isMobile ? "4vh" : "6vh",
                                display: "grid",
                            }}
                        >
                            {/* ===== ROW 1 : A B R + ABR ===== */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {["A", "B", "R"].map((n) =>
                                    renderButton(n, "ABR", singleBox, `ABR ${n}`)
                                )}

                                <div style={{ gridColumn: "span 2" }}>
                                    {renderButton("ABR", "ABR", All, "ABR,ABR")}
                                </div>
                            </div>
                            {/* ===== ROW 2 : AB AR BR + ABR CUT ===== */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {["AB", "AR", "BR"].map((n) =>
                                    renderButton(n, "ABR CUT", singleBox, `ABR CUT ${n}`)
                                )}
                                <div style={{ gridColumn: "span 2" }}>
                                    {renderButton("ABR CUT", "ABR CUT", All, "ABR,ABR CUT")}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ================= Common SP ================= */}
                    {activeMenu === 'Common SP' && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            marginTop: isMobile ? "4vh" : "6vh",
                        }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                renderButton(n, "Common SP", spBox)
                            ))}
                        </div>
                    )}
                    {/* ================= Common DP ================= */}
                    {activeMenu === 'Common DP' && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(5, 1fr)",
                                marginTop: isMobile ? "4vh" : "6vh",
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
                                renderButton(n, "Common DP", spBox)
                            ))}
                        </div>
                    )}
                    {/* ================= Color DP ================= */}
                    {activeMenu === "Color DP" && (
                        <div
                            style={{
                                width: "100%",
                                paddingTop: isMobile ? "4vh" : "6vh",
                                display: "grid",
                                gridTemplateColumns: "8fr 4fr",
                            }}
                        >
                            {/* NUMBERS GRID */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(5, 1fr)",
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) =>
                                    renderButton(n, "Color DP", spBox)
                                )}
                            </div>
                            {/* COLOR DP ALL */}
                            {renderButton("COLOR DP ALL", "Color DP", All, "Color DP,COLOR DP ALL")}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

/* ===================== STYLES ===================== */

const jodiBox: React.CSSProperties = {
    height: isMobile ? '4.5vh' : "70px",
    width: '100%',
    background: "#79c2f2",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3.5vh' : '4.5vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const singleBox: React.CSSProperties = {
    height: 70,
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const spBox: React.CSSProperties = {
    height: 70,
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const All: React.CSSProperties = {
    height: "100%",
    background: "#79c2f2",
    lineHeight: "1.5rem",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: 26,
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
};

const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0px 16px",
    alignContent: "center",
    background: active ? "#2c3e50" : "#e6e6e6",
    color: active ? "#fff" : "#000",
    fontWeight: 600,
    cursor: "pointer",
});

const panaHeader: React.CSSProperties = {
    height: isMobile ? '4.1vh' : '7vh',
    width: "90%",
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3.5vh' : '4vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const panaBox: React.CSSProperties = {
    height: isMobile ? '4.1vh' : '7vh',
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3vh' : '4vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const tpBox: React.CSSProperties = {
    height: isMobile ? '4vh' : '6vh',
    width: "100%",
    background: "#79c2f2",
    border: "1px solid #fff",
    fontFamily: "CasinoNumFont",
    fontSize: isMobile ? '3.3vh' : '4vh',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const coin: React.CSSProperties = {
    width:isMobile? 38: 46,
    height: isMobile? 38: 46,
    fontSize: isMobile ? '1.5vh' : "2.5vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "#fff",
    cursor: 'pointer',
};
export default Worli3;