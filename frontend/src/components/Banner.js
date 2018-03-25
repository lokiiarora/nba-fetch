import React from "react";

export default ({src}) => {
  return (
    <div className="banner-hero" style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    }}>
      <div className="inner-hero-holder">
          LOLOLOl
      </div>
    </div>
  );
};
