import React from "react";
import Modal from "react-modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../../services/user.service";
import { AxiosResponse } from "axios";
import SubmitButton from "../../../../components/SubmitButton";

const WithdrawModal = (props: any) => {
  const [transactionPasswordError, setTransactionPasswordError] =
    React.useState("");
  const withdrawValidationSchema = Yup.object().shape({
    narration: Yup.string().required("Remark is required").trim(),
    transactionPassword: Yup.string().required(
      "Transaction Password is required",
    ),
    amount: Yup.number()
      .required("Amount is required")
      .transform((value) => (isNaN(value) ? 0 : +value))
      .min(1, "Amount is required")
      .max(
        props.userDetails?.balance?.balance,
        `Max ${props.userDetails?.balance?.balance} limit`,
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<{
    amount: string;
    narration: string;
    transactionPassword: string;
  }>({
    resolver: yupResolver(withdrawValidationSchema),
  });

  const onSubmit = handleSubmit((data) => {
    const formData = {
      ...data,
      userId: props.userDetails?._id,
      parentUserId:
        props.userDetails?.role === "admin"
          ? props.userDetails?._id
          : props.userDetails?.parentId,
      balanceUpdateType: "W",
    };

    // UserService.updateDepositBalance(formData).then((res: AxiosResponse) => {
    //   props.closeModal('w', res.data.data)
    //   toast.success('Balance Withdrawal Successfully',{
    //     position: "top-right",
    //     autoClose: 1000,
    //     hideProgressBar: true,
    //     closeButton: false,
    //     icon: <div className="deposit-check-icon">✓</div>,
    //   })
    //   reset()
    // })
    UserService.updateDepositBalance(formData)
      .then((res: AxiosResponse) => {
        props.closeModal("w", res.data.data);

        toast.success("Balance Withdrawal Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeButton: false,
          icon: <div className="deposit-check-icon">✓</div>,
        });

        reset();
      })
      .catch((error) => {
        console.log("Withdrawal error:", error);

        const message =
          error?.response?.data?.message || "Something went wrong";

        if (message === "Transaction Password not matched") {
          setTransactionPasswordError(message);
        } else {
          toast.error(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false,
          });
        }
      });
  });

  return (
    <>
      {/* @ts-ignore Server Component */}
      <Modal
        isOpen={props.showDialog}
        onRequestClose={() => {
          props.closeModal("w");
          reset();
        }}
        contentLabel="Withdraw"
        className={"modal-dialog modal-dialogDeposit"}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Withdraw</h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              onClick={() => {
                props.closeModal("w");
                reset();
              }}
            >
              ×
            </button>
          </div>
          <form
            action=""
            id="WithdrawForm"
            method="post"
            autoComplete="off"
            onSubmit={onSubmit}
          >
            <div className="modal-body">
              <div
                className="container-fluid"
                style={{ paddingRight: "0px", paddingLeft: "0px" }}
              >
                <div className="row" style={{ marginBottom: "14px" }}>
                  <div className="col-md-4">
                    <label className="withdraw-user-first">
                      {" "}
                      {props.userDetails?.parent?.username}
                    </label>
                  </div>
                  <div className="col-md-8">
                    <span className="popup-box" id="withdraw-first">
                      {props.userDetails?.parentBalance?.balance
                        ? props.userDetails?.parentBalance?.balance?.toFixed(2)
                        : 0}
                    </span>
                    <span className="popup-box" id="withdraw-first-diff">
                      {props.userDetails?.parentBalance?.balance &&
                      watch("amount")
                        ? (
                            props.userDetails?.parentBalance?.balance +
                            +watch("amount")
                          )?.toFixed(2)
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "14px" }}>
                  <div className="col-md-4">
                    <label className="withdraw-user-second">
                      {props.userDetails?.username}
                    </label>
                  </div>
                  <div className="col-md-8">
                    <span className="popup-box" id="withdraw-second">
                      {props.userDetails?.balance?.balance
                        ? props.userDetails?.balance?.balance?.toFixed(2)
                        : 0}
                    </span>
                    <span className="popup-box" id="withdraw-second-diff">
                      {props.userDetails?.balance?.balance && watch("amount")
                        ? (
                            props.userDetails?.balance?.balance -
                            +watch("amount")
                          )?.toFixed(2)
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "14px" }}>
                  <div className="col-md-4">
                    <label>Amount</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="number"
                      className="text-right maxlength10"
                      id="withdraw-amount"
                      {...register("amount")}
                      min={0}
                      step="0.01"
                    />
                    {errors?.amount && (
                      <span className="error">{errors.amount.message}</span>
                    )}
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "14px" }}>
                  <div className="col-md-4">
                    <label>Remark</label>
                  </div>
                  <div className="col-md-8">
                    <textarea
                      id="withdraw-remark"
                      defaultValue={""}
                      {...register("narration")}
                    />
                    {errors?.narration && (
                      <span className="error">{errors.narration.message}</span>
                    )}
                  </div>
                </div>
                <div className="row" style={{ marginBottom: "14px" }}>
                  <div className="col-md-4">
                    <label>Transaction Password</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type="password"
                      id="mpassword"
                      {...register("transactionPassword")}
                      onChange={(e) => {
                        setTransactionPasswordError("");
                        register("transactionPassword").onChange(e);
                      }}
                    />
                    {/* {errors?.transactionPassword && (
                      <span className='error'>{errors.transactionPassword.message}</span>
                    )} */}
                    {errors?.transactionPassword && (
                      <span className="error">
                        {errors.transactionPassword.message}
                      </span>
                    )}

                    {transactionPasswordError && (
                      <span className="error">{transactionPasswordError}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <input type="hidden" name="uid" id="withdraw-uid" />
              <button
                type="button"
                className="btn btn-back"
                data-dismiss="modal"
                onClick={() => {
                  props.closeModal("w");
                  reset();
                }}
              >
                <i className="fas fa-undo" />
                Back
              </button>
              <SubmitButton type="submit" className="btn btn-submit">
                Submit
                <i className="fas fa-sign-in-alt" />
              </SubmitButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default WithdrawModal;
