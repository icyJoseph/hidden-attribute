import React from "react";
import axios from "axios";
import useDebounce from "../hooks/useDebounce";

const spriteUrl = id =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const idFromUrl = url => {
  const [id] = url.split("/").slice(-2, -1);
  return id;
};

const pokeService = axios.create({
  baseURL: "https://pokeapi.co/api/v2/type"
});

const DELAY = 5000;
const TIMEOUT = 2500;

pokeService.interceptors.request.use(config => {
  return new Promise(resolve => setTimeout(() => resolve(config), DELAY));
});

export function Pokemon() {
  const [query, changeQuery] = React.useState("fire");
  const debounced = useDebounce(query, 500);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!debounced) return setData([]);
    const source = axios.CancelToken.source();
    const timer = setTimeout(() => setLoading(true), TIMEOUT);
    pokeService
      .get(`/${debounced}`, {
        cancelToken: source.token
      })
      .then(({ data: { pokemon } }) => {
        return setData(pokemon);
      })
      .catch(err => {
        if (axios.isCancel(err)) {
          console.info(err.message);
        }
        return setData([]);
      });
    return () => {
      source.cancel("Cancel Pokemon fetch");
      clearTimeout(timer);
    };
  }, [debounced]);

  React.useEffect(() => {
    setLoading(false);
  }, [data]);

  return (
    <div>
      <input
        type="text"
        className="nes-input is-dark"
        value={query}
        onChange={e => changeQuery(e.target.value)}
      />
      <p className="nes-text is-success">Query: {debounced}</p>
      {loading ? (
        <div className="loader-container">
          <span>Loading</span>
          <i className="nes-octocat animate" />
        </div>
      ) : (
        <div className="pokemon-container">
          {data.slice(0, 25).map(({ pokemon: { name, url } }, index) => {
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
      )}
    </div>
  );
}

export default Pokemon;
