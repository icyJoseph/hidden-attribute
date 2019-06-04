import React from "react";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";

const endpoint = "https://pokeapi.co/api/v2/type";

const spriteUrl = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const idFromUrl = url => {
  const [id] = url.split("/").slice(-2, -1);
  return id;
};

export function Pokemon() {
  const [query, changeQuery] = React.useState("fire");
  const debounced = useDebounce(query);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (!debounced) return setData([]);
    const source = axios.CancelToken.source();
    axios
      .get(`${endpoint}/${debounced}`)
      .then(({ data: { pokemon } }) => {
        return setData(pokemon);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.info(err.message);
        }
        console.info(err);
      });
    return () => source.cancel("Cancel BitCoin fetch");
  }, [debounced]);

  return (
    <div>
      <input
        type="text"
        className="nes-input is-dark"
        value={query}
        onChange={e => changeQuery(e.target.value)}
      />
      <p className="nes-text is-success">Query: {debounced}</p>
      <div className="pokemon-container">
        {data.slice(0, 25).map(({ pokemon: { name, url } }) => (
          <div key={name} className="nes-container with-title is-dark">
            <p className="title">{name}</p>
            <img
              className="pokemon-avatar is-large"
              src={`${spriteUrl(idFromUrl(url))}`}
              alt="🤔"
              style={{ imageRendering: "pixelated" }}
              onError={e => {
                e.preventDefault();
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pokemon;
