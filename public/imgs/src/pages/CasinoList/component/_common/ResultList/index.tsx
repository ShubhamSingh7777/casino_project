import React, { useState } from "react";
import ResultListItem from "./ResultListItem";
import mobileSubheader from "../../../../_layout/elements/mobile-subheader";
import { isMobile } from "react-device-detect";
import moment from "moment";
import casinoService from "../../../../../services/casino.service";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import CasinoResultDetail from "../../../CasinoResultDetail";
import ReactPaginate from "react-paginate";

const ResultList = (props: any) => {
  const [allDocs, setAllDocs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: "",
    matchid: "",
    roundId: "",
    limit: 10,
  });
  const handleformchange = (event: any) => {
    setfilterdata({ ...filterdata, [event.target.name]: event.target.value });
  };
  const params = useParams();
  const [games, setCasinoGames] = React.useState<Array<any>>([]);
  const [goToPage, setGoToPage] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Derived: filter by search term
  const filteredDocs = React.useMemo(() => {
    if (!filterdata.roundId) return allDocs;
    return allDocs.filter((item: any) =>
      String(item.mid).toLowerCase().includes(filterdata.roundId.toLowerCase())
    );
  }, [allDocs, filterdata.roundId]);

  // Derived: pagination
  const limit = Number(filterdata.limit) || 10;
  const totalPages = Math.ceil(filteredDocs.length / limit) || 1;
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * limit, currentPage * limit);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleGoToPage = (e: any) => {
    if (e.key === 'Enter') {
       e.preventDefault();
       handlePageChange(Number(goToPage));
       setGoToPage("");
    }
  };

  const [popupdata, setPopData] = React.useState<any>({});
  const [popupstatus, setPopStatus] = React.useState<any>(false);
  React.useEffect(() => {
    const filterObj = filterdata;
    filterObj.startDate = moment().format("YYYY-MM-DD");
    filterObj.matchid = params.matchid;
    setfilterdata(filterObj);
    casinoService.getCasinoList().then((res: AxiosResponse<any>) => {
      setCasinoGames(res.data.data);
    });
    if (params.matchid) {
      setHasSearched(true);
      getdata();
    }
  }, []);

  const setPopupData = (Item: any) => {
    // eslint-disable-next-line camelcase
    setPopData({
      slug: Item.gameType,
      mid: Item.mid,
      event_data: { title: params.matchid },
    });
    setPopStatus(true);
  };
  
  const getdata = (customFilter?: any) => {
    casinoService
      .getResultList(customFilter || filterdata, 1) // page and limit ignored by backend now
      .then((res: AxiosResponse<any>) => {
        setAllDocs(res.data.data.docs || []);
        setCurrentPage(1);
      });
  };

  const handleSubmitform = (event: any) => {
    event.preventDefault();
    setHasSearched(true);
    getdata();
  };
  
  const handleSearchChange = (event: any) => {
    const val = event.target.value;
    setfilterdata((prev: any) => ({ ...prev, roundId: val }));
    setCurrentPage(1);
  };

  const handleLimitChange = (event: any) => {
    setfilterdata((prev: any) => ({ ...prev, limit: event.target.value }));
    setCurrentPage(1);
  };

  const TransactionData = () => {
    if (!hasSearched) return null;
    return paginatedDocs.length ? (
      paginatedDocs.map((item: any, index: number) => {
        return (
          <ResultListItem
            game_id={filterdata.matchid}
            key={index}
            item={item}
            index={index}
            offset={0}
            dateString={filterdata.startDate}
            setPopupData={setPopupData}
          />
        );
      })
    ) : (
      <tr>
        <td colSpan={9} style={{ textAlign: "center" }}>
          No Result Found
        </td>
      </tr>
    );
  };


  return (
    <>
      <style>{`
        .casino-results-theme .pagination-btn {
          background-color: transparent;
          border: 1px solid #ddd;
          padding: 4px 12px;
          margin: 0 4px;
          cursor: pointer;
          color: #555;
          border-radius: 2px;
        }
        .casino-results-theme .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        #customers1 tbody tr:nth-child(odd) {
          background-color: #e4e4e4;
        }
        #customers1 tbody tr:nth-child(even) {
          background-color: #f8f8f8;
        }
      `}</style>
      {mobileSubheader.subheader("Casino Results")}
      <div
        className={
          !isMobile
            ? "col-md-12 mt-1 p-0 casinoListCustom casino-results-theme"
            : "col-md-12 padding-custom casinoListCustom casino-results-theme"
        }
      >
        <div
          className=""
          style={{
            boxShadow: !isMobile ? "0 0 5px #a4a4a4" : "",
            borderRadius: "4px",
          }}
        >
          {mobileSubheader.subheaderdesktop("Casino Results")}
          <div
            className="card-body"
            style={{ padding: isMobile ? "0px" : "6px", boxShadow:!isMobile? "0 0 5px #a4a4a4":"" }}
          >
            <form
              className="ng-pristine ng-valid ng-touched mb-0"
              method="post"
              onSubmit={handleSubmitform}
            >
              <div
                className="row row5"
                style={{ marginLeft: "0px", marginRight: "0px" }}
              >
                <div
                  className="col-5 col-lg-2 mbc-5"
                  style={{
                    paddingLeft: isMobile ? "0px" : "",
                    paddingRight: isMobile ? "8px" : "",
                  }}
                >
                  <div className="form-group mb-0">
                    <div className="mx-datepicker">
                      <div className="mx-input-wrapper dateInputAcc">
                        <input
                          name="startDate"
                          type="date"
                          autoComplete="off"
                          onChange={handleformchange}
                          defaultValue={filterdata.startDate}
                          placeholder="Select Date"
                          className="mx-input ng-pristine ng-valid ng-touched"
                        />
                        <i className="far fa-calendar"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-7 col-lg-2 mbc-5"
                  style={{
                    paddingLeft: isMobile ? "0px" : "",
                    paddingRight: isMobile ? "0px" : "",
                  }}
                >
                  <div className="form-group mb-0">
                    <div className="mx-datepicker">
                      <div className="mx-input-wrapper selectAccStmt selectAccStmtCasino">
                        <select
                          className="form-control"
                          name="matchid"
                          onChange={handleformchange}
                          defaultValue={filterdata.matchid}
                          style={{fontSize: !isMobile ?'15px !important':''}}
                        >
                          <option value={""}>Select Casino Type</option>
                          {games &&
                            games.length > 0 &&
                            games.map((Item: any, index: number) => {
                              return (
                                <option
                                  selected={filterdata.matchid == Item.slug}
                                  key={index}
                                  value={Item.slug}
                                >
                                  {Item.title}
                                </option>
                              );
                            })}
                        </select>
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className='col-6 col-lg-2 mbc-5' style={{maxWidth:isMobile?'50%':'',paddingLeft:isMobile?'0px':'',paddingRight:isMobile?'8px':''}}>
                  <div className='form-group mb-0'>
                    <div className='mx-datepicker'>
                      <div className='mx-input-wrapper'>
                        <input
                          name='roundId'
                          type='text'
                          autoComplete='off'
                          onChange={handleformchange}
                          defaultValue={filterdata.roundId}
                          placeholder='Round Id'
                          className='mx-input ng-pristine ng-valid ng-touched'
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

                <div
                  className="col-12 col-lg-1 mbc-5"
                  style={{
                    paddingLeft: isMobile ? "0px" : "",
                    paddingRight: isMobile ? "0px" : "",
                  }}
                >
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div className={`row row5 mbc-5 d-flex ${!isMobile?'mt-3':''}`} style={{marginLeft:isMobile?'0px':'',marginRight:isMobile?'0px':''}}>
                  <div
                    className="col-lg-6 col-6"
                    style={{
                      paddingLeft: isMobile ? "0px" : "0px",
                      paddingRight: isMobile ? "0px" : "0px",
                      maxWidth: isMobile ? "50%" : "",
                    }}
                  >
                    <div className="mb-2 input-group input-group-showentries selectAccStmt position-relative">
                      <span className="me-2">Show</span>
                      <select className="form-select" value={filterdata.limit} onChange={handleLimitChange}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                      </select>
                      <img
                        src="/imgs/dropdownicon.svg"
                        alt=""
                        style={{
                          left: isMobile ? "105px" : "80px",
                          right: "0px",
                          width: "12px",
                        }}
                      />
                      <span className="ms-2">Entries</span>
                    </div>
                  </div>
                  <div
                    className="col-lg-6 col-6 d-flex"
                    style={{
                      paddingLeft: isMobile ? "0px" : "0px",
                      paddingRight: isMobile ? "0px" : "0px",
                      maxWidth: isMobile ? "50%" : "",
                      justifyContent: !isMobile ? "end" : "",
                      alignItems: isMobile ? "center" : "center",
                      marginBottom: isMobile ? "4px" : "",
                    }}
                  >
                    <span
                      className="me-2"
                      style={{ marginRight: isMobile ? ".5rem" : ".5rem" }}
                    >
                      Search:
                    </span>
                    <input
                      type="search"
                      className="form-control"
                      placeholder={`${filteredDocs.length} records...`}
                      style={{ width: isMobile ? "75%" : "20%" }}
                      value={filterdata.roundId}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div className="table-responsive mt-2">
                  <table id="customers1">
                    <thead>
                      <tr>
                        <th
                          className={`${
                            isMobile
                              ? "table-Head-mob text-start"
                              : "table-Head-desk text-start"
                          }`}
                          style={{
                            whiteSpace: "nowrap",
                            width: isMobile ? "150px" : "150px",
                          }}
                        >
                          Round ID
                        </th>
                        <th
                          className={`${
                            isMobile
                              ? "table-Head-mob text-start"
                              : "table-Head-desk text-start"
                          }`}
                        >
                          Winner
                        </th>
                      </tr>
                    </thead>
                    <tbody>{hasSearched ? TransactionData() : null}</tbody>
                  </table>
                </div>
                {hasSearched && allDocs.length > 0 && (
                  <div className="mt-3 text-center pb-3" style={{ fontSize: "12px", color: "#555" }}>
                    <div className="d-flex justify-content-center mb-2">
                      <button 
                        type="button"
                        className="pagination-btn" 
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >First</button>
                      <button 
                        type="button"
                        className="pagination-btn" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >Previous</button>
                      <button 
                        type="button"
                        className="pagination-btn" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                      >Next</button>
                      <button 
                        type="button"
                        className="pagination-btn" 
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                      >Last</button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      Page <strong>{currentPage} of {totalPages}</strong> | Go to Page 
                      <input 
                        type="number" 
                        className="text-center"
                        style={{ marginLeft: "4px", width: "130px", border: "1px solid #ddd", outline: 'none', padding: '2px 5px', backgroundColor: 'transparent' }}
                        value={goToPage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGoToPage(val);
                          const num = Number(val);
                          if (num > 0 && num <= totalPages) {
                            handlePageChange(num);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
          </div>
        </div>
      </div>
      <CasinoResultDetail
        popupdata={popupdata}
        setPopStatus={setPopStatus}
        popupstatus={popupstatus}
      />
    </>
  );
};
export default React.memo(ResultList);
