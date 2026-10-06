import React from "react";
import {
  useForm,
  // Resolver
} from "react-hook-form";
import User, { RoleName, RoleType } from "../../../models/User";
import UserService from "../../../services/user.service";
import { useAppSelector } from "../../../redux/hooks";
import { selectUserData } from "../../../redux/actions/login/loginSlice";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosResponse } from "axios";
import ISport from "../../../models/ISport";
import { useParams } from "react-router-dom";
import { selectSportList } from "../../../redux/actions/sports/sportSlice";
import SubmitButton from "../../../components/SubmitButton";
import { isMobile } from "react-device-detect";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .trim("User name cannot include leading and trailing spaces")
    .strict(true)
    .required("Username is required")
    .matches(
      /^(?=.*\d)[A-Z][A-Za-z0-9]*$/,
      // "Username must start with an uppercase letter and contain at least one number",
    ),
  transactionPassword: Yup.string().required(
    "Transaction Password is required",
  ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)[A-Za-z0-9]{8,32}$/,
      // "contains at least one digit,one upper case,one lower case alphabet,",
    ),
  passwordConfirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  role: Yup.string().required("Role is required"),
  fullname: Yup.string().required("Full name is required"),
  creditRefrences: Yup.string().required("Credit Reference is required"),
  exposerLimit: Yup.string().when("role", {
    is: "user",
    then: Yup.string().required("Exposer Limit is required"),
  }),
});

const AddUser = () => {
  const userState = useAppSelector<{ user: User }>(selectUserData);
  const [selectedUser, setSelectedUser] = React.useState<User>();
  const [isPartnership, setIsPartnership] = React.useState(false);
  const [isExposerAllow, setExposerAllow] = React.useState(false);
  const sportListState = useAppSelector<{ sports: ISport[] }>(selectSportList);

  const { username } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    // setError,
    formState: { errors },
  } = useForm<User>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  React.useEffect(() => {
    if (username) {
      UserService.getUserDetail(username).then((res: AxiosResponse<any>) => {
        setSelectedUser(res.data.data);
      });
    }
  }, [username]);

  const onSubmit = handleSubmit((data) => {
    // Partenership
    // if (data.role !== RoleType.user) {
    //   const partenershipValue: any = data.partnership;
    //   const partenershipArr: { [x: string]: any } = {};
    //   partenershipValue.forEach((element: undefined, index: any) => {
    //     if (element !== undefined) {
    //       partenershipArr[index] = element;
    //     }
    //   });
    //   data.partnership = partenershipArr;
    //   // User Setting
    //   const userSettingArr: { [x: string]: any } = {};

    //   const minBetValue = data.minbet;
    //   minBetValue.forEach((element: undefined, index: any) => {
    //     if (element !== undefined) {
    //       const minbetObj = { minBet: element };
    //       userSettingArr[index] = minbetObj;
    //     }
    //   });

    //   const maxBetValue = data.maxbet;
    //   maxBetValue.forEach((element: undefined, index: any) => {
    //     if (element !== undefined) {
    //       const maxbetObj = { maxBet: element };
    //       userSettingArr[index] = Object.assign(
    //         userSettingArr[index],
    //         maxbetObj,
    //       );
    //     }
    //   });

    //   const delay = data.delay;
    //   delay.forEach((element: undefined, index: any) => {
    //     if (element !== undefined) {
    //       const delayObj = { delay: element };
    //       userSettingArr[index] = Object.assign(
    //         userSettingArr[index],
    //         delayObj,
    //       );
    //     }
    //   });

    //   data.userSetting = userSettingArr;
    // }

    // Partnership
if (data.role !== RoleType.user) {
  const partnershipValue = Array.isArray(data.partnership)
    ? data.partnership
    : [];

  const partnershipArr: { [x: string]: any } = {};

  partnershipValue.forEach((element: any, index: number) => {
    if (element !== undefined) {
      partnershipArr[index] = element;
    }
  });

  data.partnership = partnershipArr;

  // User Setting
  const userSettingArr: { [x: string]: any } = {};

  // Min Bet
  const minBetValue = Array.isArray(data.minbet)
    ? data.minbet
    : [];

  minBetValue.forEach((element: any, index: number) => {
    if (element !== undefined) {
      userSettingArr[index] = {
        minBet: element,
      };
    }
  });

  // Max Bet
  const maxBetValue = Array.isArray(data.maxbet)
    ? data.maxbet
    : [];

  maxBetValue.forEach((element: any, index: number) => {
    if (element !== undefined) {
      userSettingArr[index] = {
        ...userSettingArr[index],
        maxBet: element,
      };
    }
  });

  // Delay
  const delayValue = Array.isArray(data.delay)
    ? data.delay
    : [];

  delayValue.forEach((element: any, index: number) => {
    if (element !== undefined) {
      userSettingArr[index] = {
        ...userSettingArr[index],
        delay: element,
      };
    }
  });

  data.userSetting = userSettingArr;
}

    // Parent Name
    data.parent = userData?.username;

    //Removing keys
    delete data.maxbet;
    delete data.minbet;
    delete data.delay;
    delete data.partnershipOur;

    UserService.addUser(data).then(() => {
  toast.success("User created Successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeButton: false,
        icon: <div className="deposit-check-icon">✓</div>,
      });

  reset();
});
    // .catch((e) => {
    //   const error = e.response.data.message
    //   toast.error(error)
    //   //reset()
    // })
  });

  const roleOption = () => {
    const userRole = userData.role;
    const allRoles = JSON.parse(JSON.stringify(RoleName));
    delete allRoles.admin;
    const options: Record<string, string> = allRoles;
    if (userRole && userRole != "admin") {
      const allOptions = Object.keys(options);
      const startIndex = allOptions.indexOf(userRole);
      const newArray = allOptions.slice(startIndex + 1);

      return newArray.map((option, index) => {
        if (+userRole >= ++index) return false;
        return (
          <option key={index} value={option}>
            {options[option]}
          </option>
        );
      });
    }
    return Object.keys(options).map((option, index) => {
      return (
        <option key={index} value={option}>
          {options[option]}
        </option>
      );
    });
  };

  const userData = selectedUser ? selectedUser : userState?.user;
const partnershipSports = sportListState.sports.filter(
  ({ sportId }) =>
    // sportId === 1 ||
    // sportId === 2 ||
    sportId === 4
);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 main-container">
          <div>
            <div className="add-account">
              <h2 className="m-b-20">Add Account</h2>
              <form onSubmit={onSubmit} style={{marginBottom:'0px'}}>
                <div className="row">
                  <div className="col-md-6 personal-detail">
                    <h4 className="m-b-20 col-md-12">Personal Detail</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="username">Client Name:</label>
                          {/* <input
                            placeholder='Client Name'
                            id='username'
                            {...register('username')}
                            defaultValue={''}
                            type='text'
                            className='form-control'
                          // required
                          /> */}
                          <input
                            placeholder="Client Name"
                            id="username"
                            type="text"
                            defaultValue=""
                            {...register("username", {
                              required: "Client Name is required",
                              pattern: {
                                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                                message:
                                  "Client Name must contain both letters and numbers",
                              }
                            })}
                            className={`form-control ${
                              errors.username ? "is-invalid" : "is-green-valid"
                            }`}
                          />
                          {!errors.username ? (
                            // <i className="fa fa-check valid-icon"></i>
                            <img
                              src="/imgs/tickImgAdmin.svg"
                              alt="valid"
                              className="valid-icon"
                            />
                          ):( <img
                              src="/imgs/crossInputadmin.svg"
                              alt="valid"
                              className="valid-icon"
                            />)}
                          <span
                            id="username-error"
                            className="error"
                            style={{ display: "none" }}
                          >
                            Username already taken
                          </span>
                          {/* {errors?.username && (
                            <span id="username-required" className="error">
                              {errors.username.message}
                            </span>
                          )} */}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="password">User Password:</label>
                          <input
                            maxLength={45}
                            placeholder="Password"
                            id="password"
                            {...register("password")}
                            type="password"
                            className="form-control"
                            // required
                          />
                          {/* {errors?.password && (
                            <span id="password-error" className="error">
                              {errors.password.message}
                            </span>
                          )} */}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="password_confirmation">
                            Retype Password:
                          </label>
                          <input
                            maxLength={45}
                            placeholder="Retype Password"
                            id="password_confirmation"
                            {...register("passwordConfirmation")}
                            type="password"
                            className="form-control"
                            // required
                          />
                          {errors?.passwordConfirmation && (
                            <span
                              id="password_confirmation-error"
                              className="error"
                            >
                              {errors.passwordConfirmation.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="fullname">Full Name:</label>
                          <input
                            placeholder="Full Name"
                            {...register("fullname")}
                            id="fullname"
                            defaultValue={""}
                            type="text"
                            className="form-control"
                            // required
                          />
                          {errors?.fullname && (
                            <span id="fullname-error" className="error">
                              {errors.fullname.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="city">City:</label>
                          <input
                            maxLength={15}
                            placeholder="City"
                            {...register("city")}
                            id="city"
                            defaultValue={""}
                            type="text"
                            className="form-control"
                          />
                          {errors?.city && (
                            <span id="city-error" className="error">
                              {errors.city.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="phone">Phone:</label>
                          <input
                            maxLength={10}
                            placeholder="Phone"
                            {...register("phone")}
                            id="phone"
                            type="number"
                            className="form-control"
                          />
                          {errors?.phone && (
                            <span id="phone-error" className="error">
                              {errors.phone.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 account-detail">
                    <h4 className="m-b-20 col-md-12">Account Detail</h4>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="role">Account Type:</label>
                          <select
                            {...register("role", {
                              onChange: (e) => {
                                e.target.value == RoleType.user
                                  ? setIsPartnership(true)
                                  : setIsPartnership(false);
                                e.target.value == RoleType.user
                                  ? setExposerAllow(true)
                                  : setExposerAllow(false);
                              },
                            })}
                            id="role"
                            className="form-control"
                            // required
                          >
                            <option value={""}>
                              Select Account Type
                            </option>
                            {roleOption()}
                          </select>
                          {errors?.role && (
                            <span id="role-error" className="error">
                              {errors.role.message}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="creditrefrence">
                            Credit Reference:
                          </label>
                          <input
                            className="form-control"
                            placeholder="Credit Reference"
                            {...register("creditRefrences")}
                            id="creditRefrences"
                            defaultValue={""}
                            min="0"
                            // required
                            type="number"
                          />
                          {errors?.creditRefrences && (
                            <span id="creditrefrence-error" className="error">
                              {errors.creditRefrences.message}
                            </span>
                          )}
                        </div>
                      </div>
                      {isExposerAllow && (
                        <div className="col-md-6">
                          <div className="form-group" id="exposer-limit">
                            <label htmlFor="exposerLimit">Exposer Limit:</label>
                            <input
                              placeholder="Exposer Limit"
                              id="exposerLimit"
                              {...register("exposerLimit")}
                              defaultValue={""}
                              type="number"
                              className="form-control"
                              min="0"
                              // required
                            />
                            {errors?.exposerLimit && (
                              <span id="exposerlimit-error" className="error">
                                {errors.exposerLimit.message}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* {!isExposerAllow && (
                  <div className="row m-t-20" id="partnership-div">
                    <div className="col-md-12">
                      <h4 className="m-b-20 col-md-12">Partnership</h4>
                      <div className="table-scroll">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th style={{borderBottom:'unset'}}/>
                            {sportListState.sports.map((sports: ISport) =>
                              sports.sportId === 1 ||
                              sports.sportId === 2 ||
                              sports.sportId === 4 ? (
                                <th style={{borderBottom:'unset'}} key={sports._id}>{sports.name}</th>
                              ) : (
                                <th  style={{borderBottom:'unset'}} key={sports._id} />
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Upline</td>
                            {sportListState.sports.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 || sportId == 4 ? (
                                <td
                                  id="taxpartnership-upline"
                                  key={`upline-${_id}`}
                                >
                                  {userData?.partnership?.[sportId].ownRatio}
                                </td>
                              ) : (
                                <td key={_id} />
                              ),
                            )}
                          </tr>
                          <tr>
                            <td>Downline</td>
                            {sportListState.sports?.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 || sportId == 4 ? (
                                <td key={_id}>
                                  <input
                                    className="partnership"
                                    {...register(`partnership.${sportId}`, {
                                      onChange: (e) => {
                                        const ownRatio =
                                          userData.partnership?.[sportId]
                                            .ownRatio;
                                        ownRatio
                                          ? setValue(
                                              `partnershipOur.${sportId}`,
                                              ownRatio - e.target.value,
                                            )
                                          : setValue(
                                              `partnershipOur.${sportId}`,
                                              getValues(
                                                `partnershipOur.${sportId}`,
                                              ),
                                            );
                                      },
                                    })}
                                    id={`partnership.${sportId}`}
                                    placeholder={""}
                                    max={
                                      userData?.partnership?.[sportId].ownRatio
                                    }
                                    min="0"
                                    defaultValue={0}
                                    type="number"
                                    disabled={isPartnership}
                                  />
                                  <span className="error" />
                                </td>
                              ) : (
                                <td key={_id} />
                              ),
                            )}
                          </tr>
                          <tr>
                            <td>Our</td>
                            {sportListState.sports?.map(({ _id, sportId }) =>
                              sportId == 1 || sportId == 2 || sportId == 4 ? (
                                <td
                                  id={`taxpartnership-our.${sportId}`}
                                  key={_id}
                                >
                                  <input
                                    {...register(`partnershipOur.${sportId}`)}
                                    value={
                                      userData?.partnership?.[sportId].ownRatio
                                    }
                                    // min={0}
                                    disabled={true}
                                  />
                                </td>
                              ) : (
                                <td key={_id} />
                              ),
                            )}
                          </tr>
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                )} */}
                {!isExposerAllow && (
  <div className="row m-t-20" id="partnership-div">
    <div className="col-md-12">
      <h4 className="m-b-20 col-md-12">Partnership</h4>

      <div className="table-scroll">
        <table className="table table-striped table-bordered">
          {/* <thead>
            <tr>
              <th style={{ borderBottom: "unset" }}></th>

              {partnershipSports.map((sports) => (
                <th
                  style={{ borderBottom: "unset" }}
                  key={sports._id}
                >
                  {sports.name}
                </th>
              ))}
            </tr>
          </thead> */}

          <tbody>
            {/* Upline */}
            <tr>
              <td>Upline</td>

              {partnershipSports.map(({ _id, sportId }) => (
                <td
                  id={`taxpartnership-upline-${sportId}`}
                  key={`upline-${_id}`}
                >
                  {sportId !== undefined
                    ? userData?.partnership?.[sportId]?.ownRatio ?? 0
                    : 0}
                </td>
              ))}
            </tr>

            {/* Downline */}
            <tr>
              <td>Downline</td>

              {partnershipSports.map(({ _id, sportId }) => (
                <td key={`downline-${_id}`}>
                  <input
                    className="partnership"
                    {...register(`partnership.${sportId}`, {
                      onChange: (e) => {
                        if (sportId === undefined) return;

                        const ownRatio =
                          userData?.partnership?.[sportId]?.ownRatio;

                        if (ownRatio !== undefined) {
                          setValue(
                            `partnershipOur.${sportId}`,
                            ownRatio - Number(e.target.value)
                          );
                        }
                      },
                    })}
                    id={`partnership.${sportId}`}
                    max={
                      sportId !== undefined
                        ? userData?.partnership?.[sportId]?.ownRatio
                        : undefined
                    }
                    min="0"
                    defaultValue={0}
                    type="number"
                    disabled={isPartnership}
                  />

                  <span className="error" />
                </td>
              ))}
            </tr>

            {/* Our */}
            <tr>
              <td>Our</td>

              {partnershipSports.map(({ _id, sportId }) => (
                <td
                  id={`taxpartnership-our-${sportId}`}
                  key={`our-${_id}`}
                >
                  <input
                    {...register(`partnershipOur.${sportId}`)}
                    value={
                      sportId !== undefined
                        ? userData?.partnership?.[sportId]?.ownRatio ?? 0
                        : 0
                    }
                    disabled
                    readOnly
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
                {/* <div className="row m-t-20" id="min-max-bet-div">
                  <div className="col-md-12">
                    <h4 className="m-b-20 col-md-12">Min Max Bet</h4>
                    <div className="table-scroll">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th style={{borderBottom:'unset'}}/>
                          {sportListState.sports?.map((sports: any) =>
                            sports.sportId === 1 ||
                            sports.sportId === 2 ||
                            sports.sportId === 4 ? (
                              <th style={{borderBottom:'unset'}} key={sports._id}>{sports.name}</th>
                            ) : (
                              <th style={{borderBottom:'unset'}} key={sports._id} />
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id="minbet" key={_id}>
                                {userData?.userSetting?.[sportId].minBet}
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Provide Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`minbet.${sportId}`}
                                  className={`minbet.${sportId}`}
                                  {...register(`minbet.${sportId}`)}
                                  placeholder={""}
                                  max={userData?.userSetting?.[sportId].minBet}
                                  min={0}
                                  defaultValue={0}
                                  disabled={isPartnership}
                                  type="number"
                                />
                                <span className="error" />
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Max Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id="maxbet" key={_id}>
                                {userData?.userSetting?.[sportId].maxBet}
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Provide Min Bet</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`maxbet.${sportId}`}
                                  className={`maxbet.${sportId}`}
                                  {...register(`maxbet.${sportId}`)}
                                  placeholder={""}
                                  max={userData?.userSetting?.[sportId].maxBet}
                                  defaultValue={0}
                                  disabled={isPartnership}
                                  min={0}
                                  type="number"
                                />
                                <span className="error" />
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Delay</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td id="delay" key={_id}>
                                {userData?.userSetting?.[sportId].delay}
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                        <tr>
                          <td>Provide Delay</td>
                          {sportListState.sports?.map(({ _id, sportId }) =>
                            sportId == 1 || sportId == 2 || sportId == 4 ? (
                              <td key={_id}>
                                <input
                                  id={`delay.${sportId}`}
                                  className={`delay.${sportId}`}
                                  {...register(`delay.${sportId}`)}
                                  placeholder={""}
                                  max={userData?.userSetting?.[sportId].delay}
                                  defaultValue={0}
                                  disabled={isPartnership}
                                  type="number"
                                />
                                <span className="error" />
                              </td>
                            ) : (
                              <td key={_id} />
                            ),
                          )}
                        </tr>
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div> */}
                <div className={`row ${isMobile ? 'm-t-20':'m-t-20'}`}>
                  <div className="col-md-12">
                    <div className="form-group col-md-3 float-right">
                      <label htmlFor="transactionPassword">
                        Transaction Password:
                      </label>
                      <input
                        maxLength={15}
                        placeholder="Transaction Password"
                        {...register("transactionPassword")}
                        defaultValue={""}
                        id="transactionPassword"
                        type="password"
                        className="form-control"
                      />
                      {errors?.transactionPassword && (
                        <span id="transactionPassword-error" className="error">
                          {errors.transactionPassword.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`row ${isMobile ? 'm-t-5':'m-t-14'}`}>
                  <div className="col-md-12">
                    <div className="float-right">
                      <SubmitButton className="btn btn-submit createuserBtn" type="submit">
                        Create Account
                      </SubmitButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddUser;