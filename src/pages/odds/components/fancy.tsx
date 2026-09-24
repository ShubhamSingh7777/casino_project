/* eslint-disable */
import React, { MouseEvent } from 'react'
import LFancy from '../../../models/LFancy'
import { FancyType, IFancy } from '../../../models/IFancy'
import { SocketContext } from '../../../context/webSocket'
import { FancyList } from './fancy/fancy-list'
import { isMobile } from 'react-device-detect'
import { connect } from 'react-redux'
import { selectFancyType, setFancyType } from '../../../redux/actions/bet/betSlice'
import { store } from '../../../redux/store'
import { setRules } from '../../../redux/actions/common/commonSlice'
import sportsService from '../../../services/sports.service'
import { selectCurrentMatch } from '../../../redux/actions/sports/sportSlice'

type FancyBallTypes = {
  blank: LFancy[]
  ballRun: LFancy[]
  overBallNo: LFancy[]
  [key: string]: LFancy[]
}

class Fancy extends React.Component<
  {
    fancies: LFancy[]
    matchId: string
    fancyType: string
    setRules: (data: { open: boolean; type: string }) => void
    socketUser: any
    currentMatch: any
  },
  {
    fancies: FancyBallTypes
    matchId: string
    fancyUpdate: Record<string, IFancy>
  }
> {
  static contextType = SocketContext
  context!: React.ContextType<typeof SocketContext>

  interval: any

  constructor(props: any) {
    super(props)

    const { typesFancy, updateFancy } = this.buildFancyState(props.fancies)

    this.state = {
      matchId: props.matchId,
      fancies: typesFancy,
      fancyUpdate: updateFancy,
    }
  }

  /* ----------------------------------
     BUILD STATE FROM PROPS (KEY FIX)
  ---------------------------------- */
  buildFancyState = (fancies: LFancy[]) => {
    const updateFancy: Record<string, IFancy> = {}
    const typesFancy: FancyBallTypes = {
      blank: [],
      ballRun: [],
      overBallNo: [],
    }

    fancies
      .slice()
      .sort((a, b) => a.sr_no - b.sr_no)
      .forEach((fancy) => {
        updateFancy[fancy.marketId] = {
          gtype: fancy.gtype as FancyType,
          SelectionId: fancy.marketId,
          RunnerName: fancy.fancyName,
        }

        const type = this.FancyBallTypes(fancy.fancyName)
        typesFancy[type] = [...(typesFancy[type] || []), fancy]
      })

    return { typesFancy, updateFancy }
  }

  componentDidMount(): void {
    this.socketEvents()
  }

  componentDidUpdate(prevProps: Readonly<{ fancies: LFancy[]; matchId: string }>) {
    /* MATCH CHANGE */
    if (prevProps.matchId !== this.props.matchId) {
      this.leaveSocketEvents(prevProps.matchId)
      this.socketEvents()
    }

    /* FANCY LIST CHANGE */
    if (prevProps.fancies !== this.props.fancies) {
      const { typesFancy, updateFancy } = this.buildFancyState(this.props.fancies)

      this.setState({
        fancies: typesFancy,
        fancyUpdate: updateFancy,
      })
    }
  }

  componentWillUnmount(): void {
    this.leaveSocketEvents()
    clearInterval(this.interval)
  }

  /* ----------------------------------
     SOCKET EVENTS
  ---------------------------------- */
  socketEvents = () => {
    this.context.socket.emit('joinRoom', this.props.matchId)

    if (this.props.socketUser) {
      this.props.socketUser.emit('joinRoomMatchIdWUserId', this.props.matchId)
    }

    this.getFancySockets()
    this.addNewFancy()
    this.removeFancy()
    this.suspendedFancy()

    this.context.socket.on('connect', () => {
      this.context.socket.emit('joinRoom', this.props.matchId)
    })
  }

  leaveSocketEvents = (oldMatchId?: string) => {
    this.context.socket.off('getFancyData')
    this.context.socket.off('suspendedFancy')
    this.context.socket.off('addNewFancy')
    this.context.socket.off('removeFancy')

    this.context.socket.emit('leaveRoom', oldMatchId || this.props.matchId)
  }

  getFancySockets() {
    const socketHandler = (fancy: IFancy) => {
      console.log(fancy,'fancy')
      this.setState((prev) => ({
        fancyUpdate: {
          ...prev.fancyUpdate,
          [fancy.SelectionId]: fancy,
        },
      }))
    }

    this.context.socket.on('getFancyData', socketHandler)
  }

  /* ----------------------------------
     ADD / REMOVE / SUSPEND
  ---------------------------------- */
  checkFancyKey = (allFancies: LFancy[], fancy: IFancy) =>
    allFancies.findIndex((f) => f.marketId === fancy.SelectionId)

  addNewFancy = () => {
    this.context.socket.on('addNewFancy', ({ newFancy, fancy }: any) => {
      // Map backend fields to LFancy shape:
      // Backend: RunnerName, SelectionId, marketId (market-level)
      // Frontend LFancy: fancyName, marketId (= selection ID)
      const mappedFancy: any = {
        ...newFancy,
        fancyName: newFancy.RunnerName || fancy.RunnerName,
        marketId: (newFancy.SelectionId || fancy.SelectionId || '').toString(),
        matchId: newFancy.matchId || fancy.matchId,
        sportId: newFancy.sportId || fancy.sportId,
        gtype: newFancy.gtype || fancy.gtype,
        sr_no: newFancy.sr_no || Date.now(),
        active: true,
      }

      const type = this.FancyBallTypes(mappedFancy.fancyName)
      const existing = this.state.fancies[type] || []

      // Check if this fancy already exists (by selection ID, stored as marketId in LFancy)
      if (this.checkFancyKey(existing, fancy) === -1) {
        this.setState((prev) => ({
          fancies: {
            ...prev.fancies,
            [type]: [...existing, mappedFancy].sort((a, b) => a.sr_no - b.sr_no),
          },
          fancyUpdate: {
            ...prev.fancyUpdate,
            [mappedFancy.marketId]: fancy,
          },
        }))
      }
    })
  }

  removeFancy = () => {
    this.context.socket.on('removeFancy', (fancy: any) => {
      // Backend sends SelectionId as the selection identifier,
      // but frontend LFancy uses marketId for the same value
      const selectionId = (fancy.SelectionId || '').toString()
      const type = this.FancyBallTypes(fancy.RunnerName || '')

      this.setState((prev) => {
        const fancyUpdate = { ...prev.fancyUpdate }
        delete fancyUpdate[selectionId]

        // Try to remove from the determined type bucket first
        // Also remove from all buckets as a safety net
        const updatedFancies = { ...prev.fancies }
        for (const key of Object.keys(updatedFancies)) {
          updatedFancies[key] = updatedFancies[key].filter(
            (f) => f.marketId !== selectionId
          )
        }

        return {
          fancies: updatedFancies,
          fancyUpdate,
        }
      })
    })
  }

  suspendedFancy = () => {
    this.context.socket.on('suspendedFancy', ({ fancy, type }) => {
      const group = this.FancyBallTypes(fancy.fancyName)

      this.setState((prev) => {
        const list = [...prev.fancies[group]]
        const index = list.findIndex(
          (f) => f.marketId === fancy.marketId && f.matchId === fancy.matchId,
        )

        if (index !== -1) {
          list[index] = { ...list[index], ...fancy }
        }

        return {
          fancies: { ...prev.fancies, [group]: list },
          fancyUpdate: prev.fancyUpdate,
        }
      })
    })
  }

  /* ----------------------------------
     HELPERS
  ---------------------------------- */
  FancyBallTypes(fancyName: string) {
    let type = 'blank'

    if (fancyName) {
      if (fancyName.includes(' ball run ')) type = 'ballRun'
      if (/^Only/.test(fancyName) || fancyName.includes(' ball No ')) {
        type = 'overBallNo'
      }
    }
    return type
  }

  onFancyType = (type: string) => {
    store.dispatch(setFancyType(type))
    this.setState({ fancies: {} as FancyBallTypes })
  }

  fancyheader = (title: string) => {
      const { currentMatch } = this.props

  const min = currentMatch?.inPlayFancyMinLimit ?? 0
  const max = currentMatch?.inPlayFancyMaxLimit ?? 0

  const formatMinMax = (value: number) => {
  if (value >= 10000000) return `${value / 10000000}Cr`
  if (value >= 100000) return `${value / 100000}L`
  if (value >= 1000) return `${value / 1000}K`
  return value
}
    return (
      <div className='table-header'>
        <div
          className={`float-left ${isMobile ? 'text-white' : ''
            } country-name box-6`}
        >
          {/* {isMobile ? title : ''} */}
            <span className='market-nation-nameminmax'>
          Max: {formatMinMax(max)}
        </span>
        </div>
        <div className={`${isMobile ? 'box-2' : 'box-1'} float-left lay text-center`}>
          <b>No</b>
        </div>
        <div className={`${isMobile ? 'box-2' : 'box-1'} float-left back text-center`}>
          <b>Yes</b>
        </div>
        {!isMobile && <div className='box-2 float-left' />}
      </div>
    )
  }

  fancyMenu = (fancyType: string) => {
    const menus = [
      { type: 'Normal', label: 'Normal', width: isMobile ? '36%' : '13%' },
      { type: 'Ball By Ball', label: 'BallByBall', width: isMobile ? '36%' : '14%' },
      // { type: 'session', label: 'Fancy', width: isMobile ? '19%' : '11%' },
      { type: 'fancy1', label: 'Fancy1', width: isMobile ? '28%' : '11%' },
      { type: 'meter', label: 'Meter', width: isMobile ? '24%' : '10%' },
      { type: 'khado', label: 'Khado', width: isMobile ? '22%' : '10%' },
      { type: 'oddeven', label: 'Odd/Even', width: isMobile ? '24%' : '11%' },
      { type: 'wkt', label: 'Wicket', width: isMobile ? '30%' : '10%' },
      { type: 'Four', label: 'Four', width: isMobile ? '50%' : '10%' },
      { type: 'Sixes', label: 'Six', width: isMobile ? '50%' : '11%' },

      // { type: 'Casino', label: 'Cricket Casino', width: isMobile ? '36%' : '15%' },

    ]

    return menus.map((menu) => (
      <li
        key={menu.type}
        onClick={() => this.onFancyType(menu.type)}
        style={{ width: menu.width }}
        className='nav-item'
      >
        <a
          href='#'
          onClick={(e) => e.preventDefault()}
          role='tab'
          className={`nav-link ${fancyType === menu.type ? 'active' : ''}`}
          style={{ padding: isMobile ? '' : '0.5rem 0.3rem' }}
        >
          <span style={{ textTransform: 'uppercase', fontSize: isMobile ? '' : '14px' }}>{menu.label}</span>
        </a>
      </li>
    ))
  }

  getFanciesByType = (type: string) => {
    const allFancies = [
      ...(this.state.fancies.blank || []),
      ...(this.state.fancies.overBallNo || []),
      ...(this.state.fancies.ballRun || []),
    ];

    return allFancies.filter((fancy: any) => {
      const gtype = String(fancy.gtype || "").toLowerCase();
      const fancyName = String(fancy.fancyName || "").toLowerCase();

      switch (type.toLowerCase()) {
        case "normal":
          return (
            gtype === "normal" ||
            (!gtype &&
              !fancyName.includes("ball run") &&
              !fancyName.includes("ball no"))
          );

        case "ball by ball":
          return (
            gtype === "ball by ball" ||
            gtype === "ballbyball" ||
            fancyName.includes("ball run")
          );

        case "fancy1":
          return gtype === "fancy1";

        case "meter":
          return gtype === "meter";

        case "khado":
          return gtype === "khado";

        case "oddeven":
          return gtype === "oddeven";

        case "wkt":
          return gtype === "wkt";

        case "four":
          return gtype === "four";

        case "sixes":
          return gtype === "sixes";

        default:
          return false;
      }
    });
  };


  /* ----------------------------------
     RENDER
  ---------------------------------- */
  // render() {
  //   const { fancies, fancyUpdate } = this.state
  //   const { fancyType } = this.props
  //   const clsgrid = isMobile ? 'col-12' : 'col-lg-12'

  //   return (
  //     <>
  //       <ul role='tablist' className='nav  nav-tabs fancy-group'>
  //         {this.fancyMenu(fancyType)}
  //       </ul>

  //       <div className='fancy-market row'>
  //         <div className={clsgrid}>
  //           {this.fancyheader('Session Market')}
  //           <FancyList fancies={fancies.blank} fancyUpdate={fancyUpdate} />
  //         </div>

  //         <div className={clsgrid}>
  //           {fancies.overBallNo?.length > 0 && (
  //             <>
  //               {this.fancyheader('Over by Over Session Market')}
  //               <FancyList fancies={fancies.overBallNo} fancyUpdate={fancyUpdate} />
  //             </>
  //           )}

  //           {fancies.ballRun?.length > 0 && (
  //             <>
  //               {this.fancyheader('Ball by Ball Session Market')}
  //               <FancyList fancies={fancies.ballRun} fancyUpdate={fancyUpdate} />
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </>
  //   )
  // }
  render() {
    const { fancies, fancyUpdate } = this.state;
    // console.log(fancies, 'fancydata')
    const clsgrid = isMobile ? "col-12" : "col-lg-12";

    const sections = [
      {
        type: "Normal",
        title: "NORMAL",
      },
      {
        type: "Ball By Ball",
        title: "BALLBYBALL",
      },
      {
        type: "over by over",
        title: "OVER BY OVER",
      },
      {
        type: "fancy1",
        title: "FANCY1",
      },
      {
        type: "meter",
        title: "METER",
      },
      {
        type: "khado",
        title: "KHADO",
      },
      {
        type: "oddeven",
        title: "ODD/EVEN",
      },
      {
        type: "wkt",
        title: "WICKET",
      },
      {
        type: "Four",
        title: "FOUR",
      },
      {
        type: "Sixes",
        title: "SIX",
      },
    ];

    const getSectionFancies = (type: string) => {
      const allFancies = [
        ...(fancies.blank || []),
        ...(fancies.overBallNo || []),
        ...(fancies.ballRun || []),
      ];

      return allFancies.filter((fancy: any) => {
        if (!fancy?.active) return false;
        let updatedFancy: any = {};
        if (fancyUpdate[fancy.marketId]) {
          updatedFancy = fancyUpdate[fancy.marketId];
        }
        if (updatedFancy.LayPrice1 === undefined) return false;
        const gtype = String(fancy.gtype || "").toLowerCase();
        const fancyName = String(fancy.fancyName || "").toLowerCase();

        switch (type.toLowerCase()) {
          case "normal":
            return (
              gtype === "normal" ||
              gtype === "normal1"
            );

          case "over by over":
            return (
              fancyName.includes("ball no") ||
              /^only/.test(fancyName) ||
              fancyName.includes("over run")
            );

          case "ball by ball":
            return (
              gtype === "ball by ball" ||
              gtype === "ballbyball" ||
              fancyName.includes("ball run")
            );

          case "fancy1":
            return gtype === "fancy1";

          case "meter":
            return gtype === "meter";

          case "khado":
            return gtype === "khado";

          case "oddeven":
            return gtype === "oddeven";

          case "wkt":
            return gtype === "wkt";

          case "four":
            return gtype === "four";

          case "sixes":
            return gtype === "sixes";

          default:
            return false;
        }
      });
    };

    return (
      <>
        <div className="fancy-market row">
          <div className={clsgrid}>

            {sections.map((section) => {
              const sectionFancies = getSectionFancies(section.type);

              // Don't show empty headings
              if (!sectionFancies.length) {
                return null;
              }

              return (
                <div key={section.type} className="fancy-section">

                  {/* CATEGORY HEADING */}
                  <div
                    style={{
                      background: "#2d4356",
                      color: "#fff",
                      textAlign: "start",
                      padding: isMobile ? "3px 6px" : "10px",
                      fontWeight: "bold",
                      fontSize: "13px",
                      borderBottom: "1px solid #fff",
                    }}
                  >
                    {section.title}
                  </div>

                  {/* EXISTING TABLE HEADER */}
                  {this.fancyheader("Session Market")}

                  {/* CATEGORY DATA */}
                  <FancyList
                    fancies={sectionFancies}
                    fancyUpdate={fancyUpdate}
                  />

                </div>
              );
            })}



          </div>
        </div>
      </>
    );
  }
}


const mapStateToProps = (state: any) => ({
  fancyType: state.betReducer.fancyType,
  currentMatch: selectCurrentMatch(state),
})

export default connect(mapStateToProps, {
  selectFancyType,
  setRules,
})(Fancy)
