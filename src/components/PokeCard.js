import React from "react";
import { idFromUrl, spriteUrl } from "../utils";

export default ({ name, url, showImg }) => {
  const imgSrc = spriteUrl(idFromUrl(url));

  return (
    <div
      key={name}
      className="nes-container with-title is-dark with-background"
      style={{
        backgroundImage: !showImg && `url(${imgSrc})`
      }}
    >
      <p className="title">{name}</p>
      {showImg && <img className="pokemon-avatar" src={imgSrc} alt="🤔" />}
    </div>
  );
};
