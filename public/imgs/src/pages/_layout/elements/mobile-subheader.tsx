import { isMobile } from 'react-device-detect';

const subheader = (title: string, pathname: string = '') => {
 
  return isMobile ? (
    <div
      className="game-heading"
      style={{
        backgroundColor: '#2C3E50',
        padding: '1rem 1rem',
      }}
    >
      <span
        className="card-header-title"
        style={{
          fontSize: '16px',
          fontWeight: 'inherit',
          textTransform: 'capitalize',
        }}
      >
        {title}
      </span>
    </div>
  ) : (
    ''
  );
};

const subheaderdesktop = (title: string, pathname: string = '') => {
  const isAdmin = pathname.startsWith('/admin/change-password');

  return !isMobile ? (
    <div
      className="card-header"
      style={{
        backgroundColor: isAdmin ? '#f9f9f9' : '#2C3E50',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '10px',
      }}
    >
      <h4 className="mb-0">{title}</h4>
    </div>
  ) : (
    ''
  );
};

export default { subheader, subheaderdesktop };