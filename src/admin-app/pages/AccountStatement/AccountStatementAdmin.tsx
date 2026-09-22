import moment from "moment";
import React, { MouseEvent } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import accountService from "../../../services/account.service";
import { dateFormat } from "../../../utils/helper";
import { isMobile } from "react-device-detect";
import mobileSubheader from "../_layout/elements/mobile-subheader";
import userService from "../../../services/user.service";
import CustomAutoComplete from "../../components/CustomAutoComplete";
import { AccoutStatement } from "../../../models/AccountStatement";
import betService from "../../../services/bet.service";
import { AxiosResponse } from "axios";
import ReactModal from "react-modal";
import BetListComponent from "../UnsetteleBetHistory/bet-list.component";
import { useAppSelector } from "../../../redux/hooks";
import { selectLoader } from "../../../redux/actions/common/commonSlice";
import ReactToPdf from "react-to-pdf";
import { useLocation } from "react-router-dom";

const AccountStatementAdmin = () => {
  const loadingState = useAppSelector(selectLoader);

  const [accountStmt, setAccountStmt] = React.useState<any>({});
  const [parseAccountStmt, setparseAccountStmt] = React.useState<any>([]);
  const [closeBalance, setCloseBalance] = React.useState(0);
  const [currentItems, setCurrentItems] = React.useState<any>([]);
  const [itemOffset, setItemOffset] = React.useState<any>(0);
  const [itemsPerPage] = React.useState<any>(50);
  const [pageCount, setPageCount] = React.useState<any>(0);

  const [isOpen, setIsOpen] = React.useState(false);
  const [betHistory, setBetHistory] = React.useState<any>({});
  const [selectedStmt, setSelectedStmt] = React.useState<AccoutStatement>(
    {} as AccoutStatement,
  );
  const [openBalance, setOpenBalance] = React.useState(0);
  const [profitLoss, setProfitLoss] = React.useState(0);

  const [filterdata, setfilterdata] = React.useState<any>({
    startDate: "",
    endDate: "",
    reportType: "All",
    userId: "",
  });
  const [page, setPage] = React.useState(1);
  const [pageBet, setPageBet] = React.useState(1);
  const ref: any = React.createRef();
  const location = useLocation();

  React.useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(parseAccountStmt.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(parseAccountStmt.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, parseAccountStmt]);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % parseAccountStmt.length;
    setItemOffset(newOffset);
    setPage(event.selected);
  };

  const dataformat = (response: any, closingbalance: any) => {
    const aryNewFormat: any = [];

    response &&
      response.map((stmt: any, index: number) => {
        closingbalance = closingbalance + stmt.amount;
        aryNewFormat.push({
          _id: stmt._id,
          // eslint-disable-next-line camelcase
          sr_no: index + 1,
          date: moment(stmt.createdAt).format(dateFormat),
          credit: stmt.amount,
          debit: stmt.amount,
          closing: closingbalance.toFixed(2),
          narration: stmt.narration,
          type: stmt.type,
          stmt: stmt,
        });
      });
    return aryNewFormat;
  };

  React.useEffect(() => {
    const filterObj = filterdata;
    filterObj.startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
    filterObj.endDate = moment().format("YYYY-MM-DD");
    setfilterdata(filterObj);
  }, []);

  const getAccountStmt = (page: number) => {
    accountService
      .getAccountList(page, filterdata)
      .then((res) => {
        if (res?.data?.data) setAccountStmt(res?.data?.data?.items || []);
        if (res?.data?.data?.items && page == 0)
          setOpenBalance(res?.data?.data?.openingBalance || 0);
        setProfitLoss(res?.data?.data?.totalAmount || 0);

        setparseAccountStmt(
          dataformat(
            res?.data?.data?.items || [],
            res?.data?.data?.openingBalance || 0,
          ),
        );
        setPage(page);
      })
      .catch((e) => {
        console.log(e);
        // const error = e.response.data.message
        toast.error("error");
      });
  };

  const handleformchange = (event: any) => {
    const filterObj = filterdata;
    filterObj[event.target.name] = event.target.value;
    setfilterdata(filterObj);
  };
  const handleSubmitform = (event: any) => {
    event.preventDefault();
    getAccountStmt(1);
  };

  const onSuggestionsFetchRequested = ({ value }: any) => {
    return userService.getUserListSuggestion({ username: value });
  };

  const onSelectUser = (user: any) => {
    setfilterdata({ ...filterdata, userId: user._id });
  };

  const handlePageClickBets = (event: any) => {
    getBetsData(selectedStmt, event.selected + 1);
  };

  React.useEffect(() => {
    if (isOpen) getBetsData(selectedStmt, pageBet);
  }, [selectedStmt, pageBet, isOpen]);

  const getBetsData = (stmt: AccoutStatement, pageNumber: number) => {
    const betIds: any = stmt?.allBets?.map(({ betId }: any) => betId);

    if (betIds && betIds.length > 0) {
      betService
        .getBetListByIds(betIds, pageNumber)
        .then((res: AxiosResponse) => {
          setIsOpen(true);
          setBetHistory(res.data.data);
          setPageBet(pageNumber);
        });
    }
  };

  const getBets = (
    e: MouseEvent<HTMLTableCellElement>,
    stmt: AccoutStatement,
  ) => {
    e.preventDefault();
    setBetHistory({});
    setSelectedStmt(stmt);
    setPageBet(1);
    setIsOpen(true);
  };

  const getAcHtml = () => {
    let closingbalance: number = page == 1 ? openBalance : closeBalance;
    const achtml =
      currentItems &&
      currentItems.map((stmt: any, index: number) => {
        closingbalance = closingbalance + stmt.amount;
        return (
          <tr key={`${stmt._id}${index}`}>
            <td>{stmt.sr_no}</td>
            <td className="wnwrap">{stmt.date}</td>
            <td className="green wnwrap">
              {stmt.credit >= 0 && stmt.credit.toFixed(2)}
            </td>
            <td className="red wnwrap">
              {stmt.credit < 0 && stmt.credit.toFixed(2)}
            </td>
            <td className="green wnwrap">{stmt.closing}</td>
            <td>{stmt.stmt.txnBy}</td>
            <td
              onClick={(e: MouseEvent<HTMLTableCellElement>) =>
                getBets(e, stmt.stmt)
              }
            >
              <span className={stmt.type == "pnl" ? "label-button" : ""}>
                {stmt.narration}
              </span>
            </td>
          </tr>
        );
      });
    return achtml;
  };

  return (
    <>
      {mobileSubheader.subheaderdesktopadmin("Account Statement","",location.pathname)}
      <div className="container-fluid" style={{ background: "#f9f9f9" }}>
        <div className="row">
          <div
            className={
              !isMobile ? "col-md-12" : "col-md-12 padding-custom"
            }
          >
            <div className="card-body  mb-20">
              <form
                className="ng-pristine ng-valid ng-touched mb-0"
                method="post"
                onSubmit={handleSubmitform}
              >
                <div className="row row5" style={{paddingLeft:!isMobile?'0px':''}}>
                   <div className="col-12 col-lg-2 mbc-5" style={{paddingLeft:!isMobile?'0px':''}}>
                    <div className="form-group mb-0">
                      <label className="label">Account Type</label>
                      <select
                        name="reportType"
                        onChange={handleformchange}
                        className="custom-select ng-untouched ng-pristine ng-valid"
                      >
                        <option value="ALL">All </option>
                        <option value="chip">Deposit/Withdraw </option>
                        <option value="game">Game Report </option>
                        <option value="casino">Casino</option>
                        <option value="sport">Sport</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="col-6 col-lg-2 mbc-5"
                    style={{ paddingLeft: "6px" }}
                  >
                    <label className="label">Search By Client Name</label>
                    <CustomAutoComplete
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSelectUser={onSelectUser}
                    />
                  </div>
                  <div className="col-6 col-lg-2 mbc-5">
                    <div className="form-group mb-0">
                      <label className="label">From</label>
                      <div className="mx-datepicker">
                        <div className="mx-input-wrapper">
                          <input
                            name="startDate"
                            type="date"
                            autoComplete="off"
                            onChange={handleformchange}
                            defaultValue={filterdata.startDate}
                            placeholder="Select Date"
                            className="mx-input ng-pristine bg-date ng-valid ng-touched"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-lg-2 mbc-5">
                    <div className="form-group mb-0">
                      <label className="label">To</label>
                      <div className="mx-datepicker">
                        <div className="mx-input-wrapper">
                          <input
                            name="endDate"
                            type="date"
                            autoComplete="off"
                            defaultValue={filterdata.endDate}
                            onChange={handleformchange}
                            placeholder="Select Date"
                            className="mx-input bg-date ng-untouched ng-pristine ng-valid"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  
                </div>
                <div className="col-12 col-lg-1 mbc-5" style={{paddingLeft:!isMobile ?'0px':''}}>
                    <label className="label">&nbsp;</label>
                    <button type="submit" className="btn bg-loadbtn btn-block">
                     Load
                    </button>
                  </div>
              </form>
            </div>
            <div className="card-body" ref={ref}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div className="d-flex" style={{alignItems:'center'}}>
              <div
                style={{
                  fontSize: "17px",
                  margin:isMobile ? "10px 5px":"10px 7px 10px 0px",
                  width: "fit-content",
                  padding: "5px",
                  border: "1px solid green",
                  background: "azure",
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                ProfitLoss: <span>{profitLoss.toFixed(2)}</span>
              </div>
              <ReactToPdf
                targetRef={ref}
                filename={`statement-${moment().format(
                  "MMMM-Do-YYYY-h:mm:ss-a",
                )}.pdf`}
                options={{
                  orientation: "landscape",
                  unit: "in",
                  format: "a3",
                }}
              >
                {({ toPdf }: any) => (
                  <button className="btn btn-small btn-pdf" onClick={toPdf} style={{padding:!isMobile?'0.375rem 0.75rem':'3px 6px',borderRadius:'3.5px'}}>
                    <i className="far fa-file-pdf mr-1"></i>PDF
                  
                  </button>
                )}
              </ReactToPdf>
              </div>


              <div className="page-title-right">
                <label>Search:</label>
          <input
            type="text"
            placeholder="Search..."
            className="form-controlDivDesktop"
            style={{marginLeft:'3.5px',fontSize:'14px'}}
          />
        </div>
              </div>
              <div className="table-responsive">
                <table className="text-center" id="customers1">
                  <thead>
                    <tr>
                      <th
                        style={{
                          width: "10%",
                          textAlign: "start",
                          whiteSpace: "nowrap",
                          borderRight:"unset",
                          borderBottom:"1px solid #111"
                        }}
                      >
                        Sr No.
                      </th>
                      <th
                        style={{
                          width: "20%",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          borderRight:"unset",
                          borderLeft:"unset",
                          borderBottom:"1px solid #111"
                        }}
                      >
                        Date{" "}
                      </th>
                      <th style={{ width: "10%", textAlign: "center",borderRight:"unset",
                          borderLeft:"unset",borderBottom:"1px solid #111" }}>
                        Credit{" "}
                      </th>
                      <th style={{ width: "10%", textAlign: "center",borderRight:"unset",
                          borderLeft:"unset" ,borderBottom:"1px solid #111"}}>
                        Debit
                      </th>
                      <th style={{ width: "10%", textAlign: "center",borderRight:"unset",
                          borderLeft:"unset",borderBottom:"1px solid #111" }}>
                        Balance
                      </th>
                      <th style={{ width: "10%", textAlign: "center" ,borderRight:"unset",
                          borderLeft:"unset",borderBottom:"1px solid #111"}}>
                        From
                      </th>
                      <th style={{ width: "45%", textAlign: "center" ,
                          borderLeft:"unset",borderBottom:"1px solid #111"}}>
                        Remark
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseAccountStmt.length <= 0 ||
                      (parseAccountStmt.length > 0 &&
                        parseAccountStmt.length <= 0 && (
                          <tr>
                            <td colSpan={8} className="text-center">
                              No Result Found
                            </td>
                          </tr>
                        ))}
                    {parseAccountStmt.length > 0 &&
                      parseAccountStmt.length > 0 &&
                      page == 0 && (
                        <tr key={parseAccountStmt[0]._id}>
                          <td>-</td>
                          <td className="wnwrap">
                            {moment(parseAccountStmt[0].createdAt).format(
                              dateFormat,
                            )}
                          </td>
                          <td>-</td>
                          <td>-</td>
                          <td className="wnwrap">{openBalance}</td>
                          <td className="wnwrap">Opening Balance</td>
                        </tr>
                      )}

                    {getAcHtml()}
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                breakLabel="..."
                nextLabel=">>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousLabel={"<<"}
                breakClassName={"break-me"}
              />
            </div>
          </div>
        </div>
      </div>
      {/* @ts-ignore Server Component */}
      <ReactModal
        isOpen={isOpen}
        onAfterClose={() => setIsOpen(false)}
        onRequestClose={(e: any) => {
          setIsOpen(false);
        }}
        contentLabel="Set Max Bet Limit"
        className={"col-md-12"}
        ariaHideApp={false}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5>Bets</h5>
            <button
              onClick={() => setIsOpen(false)}
              className="close float-right"
            >
              <i className="fa fa-times-circle"></i>
            </button>
          </div>
          <div className="modal-body">
            {!loadingState && (
              <BetListComponent
                bethistory={betHistory}
                handlePageClick={handlePageClickBets}
                page={page}
                isTrash={false}
              />
            )}
          </div>
        </div>
      </ReactModal>
    </>
  );
};
export default AccountStatementAdmin;