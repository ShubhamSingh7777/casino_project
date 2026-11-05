import React from "react";
import { isMobile } from "react-device-detect";
import ReactModal from "react-modal";

const CasinoRulesDetail = (props: any) => {
  const { title, gameId, isOpen, setIsOpen } = props;

 const ruleImages = [
  `/imgs/rules/${gameId}.jpg`,
  `/imgs/rules/${gameId}-2.jpg`,
  `/imgs/rules/${gameId}-3.jpg`,
  `/imgs/rules/${gameId}-4.jpg`,
  `/imgs/rules/${gameId}-5.jpg`,
  `/imgs/rules/${gameId}-6.jpg`,
  `/imgs/rules/${gameId}-7.jpg`,
  `/imgs/rules/${gameId}-8.jpg`,
  `/imgs/rules/${gameId}-9.jpg`,
  `/imgs/rules/${gameId}-10.jpg`,
  `/imgs/rules/${gameId}-11.jpg`,
  `/imgs/rules/${gameId}-12.jpg`,
  `/imgs/rules/${gameId}-13.jpg`,
  `/imgs/rules/${gameId}-14.jpg`,
  `/imgs/rules/${gameId}-15.jpg`,

];

const [imageSources, setImageSources] = React.useState(ruleImages);

React.useEffect(() => {
  setImageSources([
  `/imgs/rules/${gameId}.jpg`,
  `/imgs/rules/${gameId}-2.jpg`,
  `/imgs/rules/${gameId}-3.jpg`,
  `/imgs/rules/${gameId}-4.jpg`,
  `/imgs/rules/${gameId}-5.jpg`,
  `/imgs/rules/${gameId}-6.jpg`,
  `/imgs/rules/${gameId}-7.jpg`,
  `/imgs/rules/${gameId}-8.jpg`,
  `/imgs/rules/${gameId}-9.jpg`,
  `/imgs/rules/${gameId}-10.jpg`,
  `/imgs/rules/${gameId}-11.jpg`,
  `/imgs/rules/${gameId}-12.jpg`,
  `/imgs/rules/${gameId}-13.jpg`,
  `/imgs/rules/${gameId}-14.jpg`,
  `/imgs/rules/${gameId}-15.jpg`,
  ]);
}, [gameId]);
 const handleImageError = (index: number) => {
    setImageSources((previous) => {
      const updated = [...previous];
      const currentSrc = updated[index];

         // Try .jpeg if .jpg fails, then .png.
    if (currentSrc.endsWith(".jpg")) {
      updated[index] = currentSrc.replace(/\.jpg$/, ".jpeg");
    } else if (currentSrc.endsWith(".jpeg")) {
      updated[index] = currentSrc.replace(/\.jpeg$/, ".png");
    } else {
      // Hide the image if all extensions fail.
      updated[index] = "";
    }

      return updated;
    });
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      contentLabel="Casino Rules"
      className="modal-dialog casino-rules-modal"
      ariaHideApp={false}
    >
      <div className="modal-content">
        <div
          className="modal-header"
          style={{ padding: isMobile ? "12px 10px" : undefined }}
        >
          <h5
            style={{
              marginBottom: 0,
              fontSize: isMobile ? "16px" : undefined,
            }}
          >
            {title} Rules
          </h5>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="close float-right"
            aria-label="Close"
            style={{ padding: isMobile ? "0rem 8px" : undefined }}
          >
            <img
              className="closeIconModalWelcome"
              src="/imgs/closeIcon.svg"
              alt="Close"
              style={{ width: "12px", height: "12px" }}
            />
          </button>
        </div>

        <div
          className="modal-body casino-rules-images"
          style={{
            maxHeight: "75vh",
            overflowY: "auto",
            padding: isMobile ? "10px" : "16px",
          }}
        >
           {imageSources.map((src, index) =>
    src ? (
      <img
        key={`${gameId}-${index}`}
        src={src}
        onError={() => handleImageError(index)}
        className="wd-100"
        alt={`Game rules ${index + 1}`}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          marginBottom: "12px",
        }}
      />
    ) : null
  )}
        </div>
      </div>
    </ReactModal>
  );
};

export default React.memo(CasinoRulesDetail);