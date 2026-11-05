import { isMobile } from 'react-device-detect';

const subheader = (title: string) => {
  return isMobile ? (
    <div className="game-heading">
      <span className="card-header-title">{title}</span>
    </div>
  ) : (
    ''
  );
};

const subheaderdesktop = (title: string) => {
  return !isMobile ? (
    <div className="card-header">
      <h4 className="mb-0">{title}</h4>
    </div>
  ) : (
    ''
  );
};

const subheaderdesktopadmin = (
  title: React.ReactNode,
  subtitle: React.ReactNode = "",
  pathname: string = ""
) => {
  const hideSearchRoutes = [
    "/admin/accountstatement",
    "/admin/game-reports",
    "/admin/profitloss"
  ];

  const hideSearch = hideSearchRoutes.includes(pathname);

  return (
    <div
      className="card-header card-header-admin d-flex"
      style={{
        justifyContent: "space-between",
        alignItems: "start",
      }}
    >
      <h4>{title}</h4>

      {!hideSearch && (
        <div className="page-title-right">
          <input
            type="text"
            placeholder="Search Event"
            className="form-controlDivDesktop"
          />
        </div>
      )}

      {subtitle ? <div className="m-t-5">{subtitle}</div> : null}
    </div>
  );
};

export default {
  subheader,
  subheaderdesktop,
  subheaderdesktopadmin,
};