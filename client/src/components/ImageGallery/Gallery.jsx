import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-comments.css";
import "lightgallery/css/lg-medium-zoom.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgRotate from "lightgallery/plugins/rotate";
import lgShare from "lightgallery/plugins/share";
import lgAutoPlay from "lightgallery/plugins/autoplay";
import lgComment from "lightgallery/plugins/comment";

const Gallery = ({ children }) => {
  return (
    <LightGallery
      speed={500}
      plugins={[
        lgThumbnail,
        lgZoom,
        lgRotate,
        lgShare,
        lgAutoPlay,
        lgComment,
        lgFullscreen,
      ]}
    >
      {children}
    </LightGallery>
  );
};

export default Gallery;
