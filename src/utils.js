import axios from "axios";

export function wrapPromise(promise, source) {
  let status = "pending";
  let cancel = false;
  let result;
  let suspender = promise.then(
    r => {
      if (!cancel) {
        status = "success";
        result = r;
      }
    },
    e => {
      if (!cancel && !axios.isCancel(e)) {
        status = "error";
        result = e;
      }
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
    cancel() {
      cancel = true;
      if (source && source.cancel) {
        source.cancel("Cancel Promise");
      }
    }
  };
}

export const spriteUrl = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export const idFromUrl = url => {
  const [id] = url.split("/").slice(-2, -1);
  return id;
};
