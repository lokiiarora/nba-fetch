import React from "react";

export default ({src, positionStyle}) => {
  return (
    <div className="banner-hero" style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: 'cover',
        backgroundPosition: positionStyle,
    }}/>
  );
};
