import React from "react";
import useSWR from "swr";

async function fetchUser(user) {
  if (!user) {
    return { login: null };
  }
  const stored = localStorage.getItem(user);
  if (!stored) {
    const data = await fetch(`https://api.github.com/users/${user}`).then(
      res => {
        if (res.status === 404) {
        //   localStorage.setItem(user, JSON.stringify({ login: null }));
          throw new Error("Not found");
        }
        return res.json();
      }
    );

    localStorage.setItem(user, JSON.stringify(data));
    return data;
  }
  return JSON.parse(stored);
}

class ErrorBound extends React.Component {
  state = {
    hasError: false
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    return (
      prevProps.user !== this.props.user && this.setState({ hasError: false })
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const useDevData = dev => {
  const { data = { login: null } } = useSWR(dev, fetchUser, {
    shouldRetryOnError: false,
    suspense: true,
    revalidateOnFocus: false
  });

  return data;
};

export const Card = ({ user }) => {
  const { avatar_url, login, name, bio, hireable } = useDevData(user);

  return (
    login && (
      <div className="about">
        <div className="about-img">
          <img src={avatar_url} alt={login} />
        </div>
        <div className="about-desc">
          <div>
            <h6>{name}</h6>
            <p>
              <code>@{login}</code>
            </p>
            <p>{bio}</p>
            <p>Happily Employed? {hireable ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
    )
  );
};

const DevCard = () => {
  const [user, setUser] = React.useState("");
  const _input = React.useRef();

  const handleSubmit = e => {
    e.preventDefault();
    setUser(_input.current.value);
  };

  return (
    <div className="content">
      <form className="search-bar" onSubmit={handleSubmit}>
        <label htmlFor="search-user" className="screen-reader">
          Search
        </label>
        <input
          id="search-user"
          type="text"
          ref={_input}
          placeholder="Who am I?"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        ></input>
        <button type="submit">👨‍💻</button>
      </form>
      <ErrorBound user={user} fallback={<p className="fallback">Error!</p>}>
        <React.Suspense fallback={<p className="fallback">Loading...</p>}>
          <Card user={user} />
        </React.Suspense>
      </ErrorBound>
    </div>
  );
};

export default DevCard;
