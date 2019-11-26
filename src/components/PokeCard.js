import React from "react";
import { wrapPromise } from "../utils";

const delay = (res, time) =>
  new Promise(accept => setTimeout(() => accept(res), time));

export const fetchImage = (url, index) =>
  wrapPromise(
    fetch(url)
      .then(res => delay(res, index * 1000))
      .then(response => response.blob())
      .then(data => {
        const objectURL = URL.createObjectURL(data);
        return objectURL;
      })
  );

export const Image = ({ resource }) => (
  <img className="pokemon-avatar" src={resource.read()} alt="🤔" />
);

export default ({ name, resource }) => {
  const deferredResource = React.useDeferredValue(resource, {
    timeoutMs: 5000
  });

  return (
    <div
      key={name}
      className="nes-container with-title is-dark with-background"
    >
      <p className="title">{name}</p>
      <React.Suspense fallback={<i className="nes-pokeball moving" />}>
        <Image resource={deferredResource} />
      </React.Suspense>
    </div>
  );
};
