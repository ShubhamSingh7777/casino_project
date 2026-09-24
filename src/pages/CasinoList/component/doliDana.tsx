import React from 'react';
import { useParams } from 'react-router-dom';
import ButtonItem from './_common/new/ButtonItem';
import { isMobile} from 'react-device-detect';

const Dolidana = ({ lastOdds, liveMatchData }: any) => {
    const { gameCode } = useParams();

    /* ================= VALUE BG ================= */
    const valueBgStyle: React.CSSProperties = {
        backgroundColor: '#72bbef',
        marginTop:isMobile?'2px': '0px',
        height: "46px"
    };

    /* ================= DATA ================= */
    const markets = liveMatchData?.event_data?.market || [];
    const bySubtype = (t: string) =>
        markets
            .filter((m: any) => m?.Runners?.[0]?.subtype === t)
            .map((m: any) => m?.Runners?.[0])
            .filter(Boolean);

    const [playerA, playerB] = bySubtype('main');
    const anyPair = bySubtype('anypair')[0];
    const oddEven = bySubtype('oddeven');
    const lucky7 = bySubtype('lucky7');
    const sumPair = bySubtype('sumpair');
    const sumTotal = bySubtype('sumtotal');

    const less7 = lucky7?.find((r: any) => r.runnerName?.toLowerCase().includes('less'));
    const greater7 = lucky7?.find((r: any) => r.runnerName?.toLowerCase().includes('greater'));


    /* ✅ SAFE MAP */
    const safeMap = (arr: any[]) => arr.filter((r) => r && r.sid);

    /* ✅ ODD VALUE HELPER (FIX) */
    const oddVal = (sid: number) => lastOdds?.[sid]?.b ?? '-';

    /* ================= UI ================= */
    return (
        <>
            <div className="container casino-32A" style={{paddingLeft:isMobile?'5px':'',paddingRight:isMobile?'5px':'',marginTop:isMobile?'10px':'3px'}}>
                {/* ================= TOP SECTION ================= */}
                <div className="row d-flex align-items-center mb-3" style={{marginRight:isMobile?'0px':'',marginLeft:isMobile?'0px':'',marginBottom:isMobile?'10px':'13px'}}>

                    {/* Player A / B */}
                    <div className="col-12 col-md-5" style={isMobile ? { padding: "0px",paddingRight:"0px" } : {paddingLeft:"0px",paddingRight:"10px"}}>
                        {safeMap([playerA, playerB]).map((r: any) => (
                            <div
                                key={r.sid}
                                className="d-flex justify-content-between align-items-start"
                                style={isMobile ? { border: "1px solid #c7c8ca", paddingLeft: "2%"} : {border: "1px solid #c7c8ca",paddingLeft:"0%"}}
                            >
                                <span className='text-table-color' style={{ ...(isMobile ? { fontSize: 12,marginTop:"5px" } : { fontSize: 16 ,paddingLeft:'5px',paddingTop:'5px'}), fontWeight: 600 }}>
                                    {r?.runnerName}
                                </span>
                                <span className='dolidana-suspended text-table-color'
                                    style={{
                                        ...(isMobile ? { width: '25%', } : { width: '20%', }),
                                        textAlign: 'center',
                                        fontWeight: 400,
                                        fontSize:16,
                                        borderRadius:isMobile?'2px': '0px',
                                        ...valueBgStyle,
                                        ...(isMobile && { marginTop: 0 }),
                                    }}
                                >
                                    <ButtonItem
                                        selectionid={r.sid}
                                        title={oddVal(r.sid)}
                                        bs={true}
                                        lastOdds={lastOdds}
                                        liveMatchData={liveMatchData}
                                    />
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Any Pair */}
                    {anyPair?.sid && (
                        <div className="col-12 col-md-1 p-0" style={isMobile ? { marginTop: "2%" } : {flex: '0 0 11%', maxWidth: '11%' }}>
                            <div className="text-center">
                                <div className='text-table-color' style={{ ...(isMobile ? { fontSize: 9 } : { fontSize: 12}), fontWeight: isMobile ?'bold':'600' }}>
                                    Any Pair
                                </div>
                                <div className='dolidana-suspended'
                                    style={{
                                        fontSize:isMobile? '16':'16',
                                        fontWeight: 700,
                                        minHeight: "60px",
                                        borderRadius:isMobile?'2px': '4px',
                                        ...valueBgStyle,
                                    }}
                                >
                                    <ButtonItem
                                        selectionid={anyPair.sid}
                                        title={oddVal(anyPair.sid)}
                                        lastOdds={lastOdds}
                                        liveMatchData={liveMatchData}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Odd / Even */}
                    <div className="col-4 col-md-3 d-flex gap-1" style={isMobile ? { backgroundColor: "#0000000a", padding: "2%", borderRadius: "5px", margin: "1.5%",width:"calc(40% - 5px)"} : { backgroundColor: "#0000000a", padding: "8px", borderRadius: "5px", margin: "1.5%",maxWidth:"calc(20% - 5px)"}}>
                        {safeMap(oddEven).map((r: any) => (
                            <div
                                key={r.sid}
                                className="text-center flex-fill"
                                style={{ padding: '1px',width:!isMobile ?'calc(11% - 20px)':'' }}
                            >
                                <div style={{ ...(isMobile ? { fontSize: 9 } : { fontSize: 12 }), fontWeight: 600 }}>
                                    {r.runnerName}
                                </div>
                                <div className='dolidana-suspended' style={{ fontWeight: 700, borderRadius: isMobile ? '2px' : '4px', ...valueBgStyle }}>
                                    <ButtonItem
                                        selectionid={r.sid}
                                        title={oddVal(r.sid)}
                                        lastOdds={lastOdds}
                                        liveMatchData={liveMatchData}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <7 | 7 | >7 */}
                    <div className="col-6 col-md-3" style={isMobile ? { backgroundColor: "#0000000a", padding: "2%", borderRadius: "5px", margin:isMobile? "1.5% 6px":"1.5%" } : { padding: "8px",backgroundColor: "#0000000a", borderRadius: "5px", margin:"0px"}}>
                        <div className="d-flex text-center align-items-center">

                            {/* < 7 */}
                            <div className="flex-fill">
                                {less7 && (
                                    <>
                                        <div style={{ ...(isMobile ? { fontSize: 9 } : { fontSize: 12 }), fontWeight: 600 }}>
                                            &lt; 7
                                        </div>
                                        <div className="dolidana-suspended" style={{ fontWeight: 700, ...valueBgStyle , borderRadius:isMobile?'2px': '4px',}}>
                                            <ButtonItem
                                                selectionid={less7.sid}
                                                title={oddVal(less7.sid)}
                                                lastOdds={lastOdds}
                                                liveMatchData={liveMatchData}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* 7 IMAGE ONLY */}
                            <div className="flex-fill d-flex justify-content-center">
                                <img
                                    src="/trape-seven.png"
                                    alt="7"
                                    style={{ height:isMobile? 52: 60 }}
                                />
                            </div>

                            {/* > 7 */}
                            <div className="flex-fill">
                                {greater7 && (
                                    <>
                                        <div style={{ ...(isMobile ? { fontSize: 9 } : { fontSize: 12 }), fontWeight: 600 }}>
                                            &gt; 7
                                        </div>

                                        <div className="dolidana-suspended" style={{ fontWeight: 700, borderRadius:isMobile?'2px': '4px', ...valueBgStyle  }}>
                                            <ButtonItem
                                                selectionid={greater7.sid}
                                                title={oddVal(greater7.sid)}
                                                lastOdds={lastOdds}
                                                liveMatchData={liveMatchData}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
                {/* ================= LOWER SECTION ================= */}
                <div className={`row ${isMobile ? 'gx-3' : ''}`}  style={{marginRight:isMobile?'0px':'',marginLeft:isMobile?'0px':'',gap:!isMobile?'10px':'',flexWrap:isMobile?'wrap':'nowrap'}}>
                    {/* Particular Pair */}
                    <div className="col-12 col-md-4" style={isMobile ? { backgroundColor: "#0000000a", padding:"8px", borderRadius: "5px", marginBottom: "1.5%" } : {backgroundColor: "#0000000a", padding: "1%", borderRadius: "4px", marginBottom: "0px"}}>
                        <div className="" style={isMobile ? {} : { paddingRight: '7px' }}>
                            <div className='text-table-color' style={{fontSize:isMobile?'16px':'', fontWeight:isMobile?'bold':'700', marginBottom:isMobile? 4:6 }}>
                                Particular Pair
                            </div>
                            <div className="row" style={isMobile ? { padding: "0px 3%" } : {marginLeft:'0px',marginRight:'0px'}}>
                                {safeMap(sumPair).map((r: any) => (
                                    <div key={r.sid} className="col-2 col-md-4 mb-2" style={{ padding: '2px' }}>
                                        <div className="text-center text-table-color">
                                            <div style={{ ...(isMobile ? { fontSize: 9 } : { fontSize: 12 }), fontWeight: 600 }}>
                                                {r.runnerName}
                                            </div>
                                            <div className="dolidana-suspended" style={{ fontWeight: 700, borderRadius: isMobile ? '2px' : '4px', ...valueBgStyle }}>
                                                <ButtonItem
                                                    selectionid={r.sid}
                                                    title={oddVal(r.sid)}
                                                    lastOdds={lastOdds}
                                                    liveMatchData={liveMatchData}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Odds of Sum Total */}
                    <div className="col-12 col-md-8" style={isMobile ? { backgroundColor: "#0000000a", padding: "2%" } : {backgroundColor: "#0000000a", padding: "2%",borderRadius: "4px",maxWidth:"64.666667%",marginBottom:'0px'}}>
                        <div style={isMobile ? {} : { padding: '0%' }}>
                            <div className='text-table-color' style={{fontSize:isMobile?'16px':'', fontWeight:isMobile?'bold':'700', marginBottom:isMobile? 4:6 }}>
                                Odds of Sum Total
                            </div>
                            <div className="row justify-content-center" style={isMobile ? { padding: "0px 3%" } : {}}>
                                {safeMap(sumTotal).map((r: any) => (
                                    <div key={r.sid} className="col-2 mb-2" style={{ padding: '2px',maxWidth:!isMobile?'15.6667%':'' }}>
                                        <div className="text-center text-table-color">
                                            <div style={{ ...(isMobile ? { fontSize: 9 } : { fontSize: 12 }), fontWeight: 600 }}>
                                                {r.runnerName}
                                            </div>
                                            <div className="dolidana-suspended" style={{ fontWeight: 700, borderRadius:isMobile?'2px': '4px', ...valueBgStyle }}>
                                                <ButtonItem
                                                    selectionid={r.sid}
                                                    title={oddVal(r.sid)}
                                                    lastOdds={lastOdds}
                                                    liveMatchData={liveMatchData}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {
                isMobile && (
                    <img src="/imgs/dolidanaRules.png" alt=""style={{width:"100%"}} />
                )
            }
        </>
    );
};

export default Dolidana;