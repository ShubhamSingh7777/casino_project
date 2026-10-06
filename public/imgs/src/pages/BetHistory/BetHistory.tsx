import React from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import UserService from "../../services/user.service";
import moment from "moment";
import { isMobile } from "react-device-detect";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import { IBetOn } from "../../models/IBet";
import { SportName, SportsType } from "../../models/SportTypes";

const BetHistory = () => {
  const [bethistory, setbethistory] = React.useState<any>({});
  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: "",
    endDate: "",
    status: "completed",
    betStatus: "matched",
  });
  const [page, setPage] = React.useState(1);
  const [isLoading, setloading] = React.useState<any>(false);
  React.useEffect(() => {
    const filterObj = filterdata;
    filterObj.startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
    filterObj.endDate = moment().format("YYYY-MM-DD");
    setfilterdata(filterObj);
    getbethistory(1);
  }, []);

  const getbethistory = (page: number) => {
    UserService.getUsercompletedbets(page, filterdata)
      .then((res) => {
        res && res.data && res.data.data && setbethistory(res.data.data);
        setPage(page);
      })
      .catch((e) => {
        const error = e.response.data.message;
        toast.error(error);
      });
  };
  const createSrNo = (index: number) => {
    return (page - 1) * bethistory.limit + index + 1;
  };
  const trrepeat = (Item: any, index: number) => {
    const classdata = Item.isBack ? "back" : "lay";
    return (
      <>
        <tr key={index} className={classdata}>
          {/* <td>{createSrNo(index)}</td> */}
          <td className="text-center wnwrap">{Item.matchName}</td>
          <td className="text-center wnwrap">{`${Item.selectionName} / ${
            Item.bet_on == IBetOn.FANCY && Item.gtype !== "fancy1"
              ? Item.volume
              : Item.odds
          }`}</td>
          <td className="text-center wnwrap">
            {SportName[Item.sportId]}{" "}
            {Item.sportId == SportsType.casino ? `(${Item.marketId})` : null}
          </td>
          <td className="text-center wnwrap">{Item.marketName}</td>
          <td className="text-center wnwrap">{Item.odds?.toFixed(2)}</td>
          <td className="text-center wnwrap">{Item.stack}</td>
          <td
            className={`text-center wnwrap ${
              Item.profitLoss > 0 ? "green" : "red"
            }`}
          >
            {Item.profitLoss.toFixed(2)}
          </td>
          <td className="text-center wnwrap">
            {moment(Item.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </td>
        </tr>
      </>
    );
  };
  const handleformchange = (event: any) => {
    const filterObj = filterdata;
    if (event.target.name == "bet_status") {
      filterObj.status =
        event.target.value == "matched" ? "completed" : "deleted";
    }
    if (filterObj.status === "deleted") return false;
    filterObj[event.target.name] = event.target.value;
    setfilterdata(filterObj);
  };
  const handleSubmitform = (event: any) => {
    event.preventDefault();
    getbethistory(1);
  };
  const handlePageClick = (event: any) => {
    getbethistory(event.selected + 1);
  };

  const TransactionData =
    bethistory && bethistory.docs && bethistory.docs.length ? (
      bethistory.docs.map((item: any, index: number) => {
        return trrepeat(item, index);
      })
    ) : isLoading ? (
      <tr>
        <td colSpan={8} style={{ textAlign: "center" }}>
          Please wait
        </td>
      </tr>
    ) : (
      <tr>
        <td colSpan={8} style={{ textAlign: "center" }}>
          No Result Found
        </td>
      </tr>
    );
  return (
    <>
      {mobileSubheader.subheader("Current Bets")}
      <div
        className={
          !isMobile
            ? " mt-1 casinoListCustom"
            : "padding-custom casinoListCustom"
        }
      >
        <div
          className=""
          style={{
            boxShadow: !isMobile ? "0 0 5px #a4a4a4" : "",
            borderRadius: "4px",
          }}
        >
          {mobileSubheader.subheaderdesktop("Current Bets")}
          <div
            className="card-body"
            style={{ padding: isMobile ? "0px" : "6px" }}
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
                {/* <div className='col-6 col-lg-2 mbc-5'  style={{maxWidth:isMobile?'50%':'',paddingLeft:isMobile?'0px':'',paddingRight:isMobile?'8px':''}}>
                  <div className='form-group mb-0'>
                    <div className='mx-datepicker'>
                      <div className='mx-input-wrapper'>
                        <input
                          name='startDate'
                          type='date'
                          autoComplete='off'
                          onChange={handleformchange}
                          defaultValue={filterdata.startDate}
                          placeholder='Select Date'
                          className='mx-input ng-pristine ng-valid ng-touched'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-6 col-lg-2 mbc-5' style={{maxWidth:isMobile?'50%':'',paddingLeft:isMobile?'0px':'',paddingRight:isMobile?'0px':''}}>
                  <div className='form-group mb-0'>
                    <div className='mx-datepicker'>
                      <div className='mx-input-wrapper'>
                        <input
                          name='endDate'
                          type='date'
                          autoComplete='off'
                          defaultValue={filterdata.endDate}
                          onChange={handleformchange}
                          placeholder='Select Date'
                          className='mx-input ng-untouched ng-pristine ng-valid'
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                <div
                  className={`col-12 col-lg-2 ${isMobile ? "mt-5 mb-2" : "mb-2"}`}
                  style={{
                    paddingRight: isMobile ? "0px" : "5px",
                    paddingLeft: isMobile ? "0px" : "0px",
                  }}
                >
                  <div className="form-group mb-0">
                    <select
                      name="reportType"
                      onChange={handleformchange}
                      className="custom-select ng-untouched ng-pristine ng-valid"
                    >
                      <option value="">Select Report Type </option>
                      <option value="4">Cricket </option>
                      <option value="1">Football </option>
                      <option value="2">Tennis </option>
                      <option value="5000">Casino </option>
                    </select>
                  </div>
                </div>
                {/* <div className={`col-12 col-lg-2 ${isMobile?'mbc-5':'mb-5'}`} style={{maxWidth:isMobile?'50%':'',paddingLeft:isMobile?'0px':'0px',paddingRight:isMobile?'0px':'0px'}}>
                  <div className='form-group mb-0'>
                    <select
                      name='bet_status'
                      onChange={handleformchange}
                      className='custom-select ng-untouched ng-pristine ng-valid'
                    >
                      <option value='ALL'>Bet Status</option>
                      <option value='completed'>Matched </option>
                      <option value='deleted'>Deleted </option>
                    </select>
                  </div>
                </div> */}
                <div
                  className={`col-12 col-lg-2 ${isMobile ? "mb-1 mt-0" : "mb-2"}`}
                  style={{
                    paddingLeft: isMobile ? "0px" : "5px",
                    paddingRight: isMobile ? "0px" : "",
                  }}
                >
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </div>
                <div className="col-12 col-lg-12 mbc-5 d-flex">
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
                      <select className="form-select">
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
                      placeholder="0 records..."
                      style={{ width: isMobile ? "75%" : "20%" }}
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="mt-2 table-responsive">
              <table id="customers1">
                <thead>
                  <tr>
                    {/* <th
                      className={`${
                        isMobile ? "table-Head-mob" : "table-Head-desk"
                      } text-center`}
                    >
                      No
                    </th> */}
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-start"
                      }`}
                    >
                      Event Name
                    </th>
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-start"
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Nation
                    </th>
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-end"
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Event Type
                    </th>
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-end"
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Type
                    </th>
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-end"
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Rate
                    </th>
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-end"
                      }`}
                    >
                      Amount
                    </th>
                    <th
                      className={`${
                        isMobile ? "table-Head-mob" : "table-Head-desk"
                      } text-center`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      PNL
                    </th>{" "}
                    <th
                      className={`${
                        isMobile ? "table-Head-mob text-center" : "table-Head-desk text-start"
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Place Date
                    </th>
                  </tr>
                </thead>
                <tbody>{TransactionData}</tbody>
              </table>
            </div>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">>"
              onPageChange={handlePageClick}
              pageRangeDisplayed={1}
              pageCount={bethistory.totalPages}
              containerClassName={"pagination"}
              activeClassName={"active"}
              previousLabel={"<<"}
              breakClassName={"break-me"}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default BetHistory;
