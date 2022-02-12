import React from "react";
import axios from "axios";
import PokeCard, { fetchImage } from "../components/PokeCard";
import { idFromUrl, spriteUrl, wrapPromise } from "../utils";

const DELAY = 4000;
const TIMEOUT = 2500;

const pokeService = axios.create({
  baseURL: "https://pokeapi.co/api/v2/type"
});

pokeService.interceptors.request.use((config) => {
  return new Promise((resolve) => setTimeout(() => resolve(config), DELAY));
});

function fetchPokemonByType(query) {
  const source = axios.CancelToken.source();
  return wrapPromise(
    pokeService
      .get(`/${query}`, { cancelToken: source.token })
      .then(({ data: { pokemon, results } }) => {
        if (pokemon) {
          return pokemon.map(({ pokemon: { name, url } }) => ({ name, url }));
        }
        return results;
      })
      .catch(() => {
        return [];
      }),
    source
  );
}

// tail="collapsed"

const PokemonTypes = ({ resource, isStale, order = "forwards" }) => {
  return (
    <div className={`pokemon-container ${isStale ? "stale" : ""}`}>
      {/* <React.SuspenseList revealOrder={order} tail={"collapsed"|"hidden"}> */}
      <React.SuspenseList revealOrder={order}>
        {resource
          .read()
          .slice(0, 25)
          .map(({ name, url }, index, src) => {
            const imgUrl = spriteUrl(idFromUrl(url));
            const modifier =
              order === "backwards" ? src.length - index : index + 1;
            const resource = fetchImage(imgUrl, modifier);
            return <PokeCard key={name} name={name} resource={resource} />;
          })}
      </React.SuspenseList>
    </div>
  );
};

const INIT_TYPE = "fire";
const initialResource = fetchPokemonByType(INIT_TYPE);

export function Pokemon() {
  const [query, changeQuery] = React.useState(INIT_TYPE);
  const [resource, setResource] = React.useState(initialResource);
  const [startTransition, isPending] = React.useTransition({
    timeoutMs: TIMEOUT
  });

  const _ref = React.useRef();

  const handleChange = (e) => {
    const query = e.target.value;
    if (_ref.current) {
      _ref.current.cancel();
    }
    changeQuery(query);
    startTransition(() => {
      _ref.current = fetchPokemonByType(query);
      setResource(_ref.current);
    });
  };

  const deferredResource = React.useDeferredValue(resource, {
    timeoutMs: TIMEOUT
  });

  const isStale = resource !== deferredResource;

  return (
    <div>
      <input
        type="text"
        className="nes-input is-dark"
        value={query}
        onChange={handleChange}
      />
      <p className="nes-text is-success">Query: {query}</p>
      {isPending && <span>Pending...</span>}
      <React.Suspense fallback={<i className="nes-octocat animate" />}>
        <PokemonTypes
          resource={deferredResource}
          isStale={isStale}
          order="forwards"
        />
      </React.Suspense>
    </div>
  );
}

// order "forwards" to "backwards" or "together"

export default Pokemon;
