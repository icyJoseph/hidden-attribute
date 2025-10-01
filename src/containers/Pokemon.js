import React from "react";
import useDebounce from "../hooks/useDebounce";
import useSWR from "swr";

const endpoint = "https://pokeapi.co/api/v2";

const spriteUrl = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const idFromUrl = url => {
  const [id] = url.split("/").slice(-2, -1);
  return id;
};

async function fetcher(query) {
  const res = await fetch(`${endpoint}/${query}`)
  const data = await res.json()
  return data
}


export function Pokemon() {
  const id = React.useId()
  const [query, changeQuery] = React.useState("fire");
  const debounced = useDebounce(query, 500);

  const { data } = useSWR(`/type/${query}`, fetcher, { suspense: true })

  return (
    <div>
      <input
        id={id}
        type="text"
        className="nes-input is-dark"
        value={query}
        onChange={e => changeQuery(e.target.value)}
      />
      <p className="nes-text is-success">Query: {debounced}</p>
      <div className="pokemon-container">
        {data.pokemon.slice(0, 25).map(({ pokemon: { name, url } }, index) => {
          const imgSrc = spriteUrl(idFromUrl(url));
          const showImg = index % 2 === 0;
          return (
            <div
              key={name}
              className="nes-container with-title is-dark with-background"
              style={{
                backgroundImage: !showImg && `url(${imgSrc})`
              }}
            >
              <p className="title">{name}</p>
              {showImg && (
                <img className="pokemon-avatar" src={imgSrc} alt="🤔" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Pokemon;
