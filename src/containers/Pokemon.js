import React from "react";
import useDebounce from "../hooks/useDebounce";
import useSWR from "swr";

const endpoint = "https://pokeapi.co/api/v2";

const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const idFromUrl = (url) => {
  const [id] = url.split("/").slice(-2, -1);
  return id;
};

async function fetcher(query) {
  const res = await fetch(`${endpoint}${query}`);

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    throw new Error(`Failed to fetch "${query}"`);
  }

  const data = await res.json();
  return data;
}

function PokemonListByType({ type }) {
  const normalizedType = type.trim().toLowerCase();
  const path = `/type/${normalizedType}`;
  const { data } = useSWR(path, fetcher, { suspense: true });

  if (normalizedType === "") {
    return (
      <div>
        <p className="nes-text">Available types:</p>
        <ul>
          {data.results.map(({ name }) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="nes-text is-error">
        Zero results returned for "{type}". Try a different type name.
      </p>
    );
  }

  return (
    <>
      {data.pokemon.slice(0, 25).map(({ pokemon: { name, url } }, index) => {
        const imgSrc = spriteUrl(idFromUrl(url));
        const showImg = index % 2 === 0;
        return (
          <div
            key={name}
            className="nes-container with-title is-dark with-background"
            style={{ backgroundImage: !showImg && `url(${imgSrc})` }}
          >
            <p className="title">{name}</p>
            {showImg && (
              <img className="pokemon-avatar" src={imgSrc} alt="🤔" />
            )}
          </div>
        );
      })}
    </>
  );
}

export function PokemonTypeSearch() {
  const id = React.useId();
  const [query, changeQuery] = React.useState("fire");
  const debounced = useDebounce(query, 550);

  return (
    <div>
      <input
        id={id}
        type="text"
        className="nes-input is-dark"
        value={query}
        onChange={(e) => changeQuery(e.target.value)}
      />
      <p className="nes-text is-success">Query: {debounced}</p>

      <div className="pokemon-container">
        <React.Suspense fallback={<i className="nes-octocat animate" />}>
          <PokemonListByType type={debounced} />
        </React.Suspense>
      </div>
    </div>
  );
}

export default PokemonTypeSearch;
