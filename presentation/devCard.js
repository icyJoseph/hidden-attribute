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

async function fetchOrg(orgUrl) {
  if (!orgUrl) {
    return { login: null };
  }
  const stored = localStorage.getItem(orgUrl);
  if (!stored) {
    const data = await fetch(orgUrl).then(res => {
      return res.json();
    });

    localStorage.setItem(orgUrl, JSON.stringify(data));
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

const swrOpts = {
  shouldRetryOnError: false,
  suspense: true,
  revalidateOnFocus: false
};
const useDevData = dev => {
  const { data = { login: null } } = useSWR(dev, fetchUser, swrOpts);

  return data;
};

const useOrganizations = url => {
  const { data = [] } = useSWR(url, fetchOrg, swrOpts);
  return data;
};

const OrganizationsAvatars = ({ url }) => {
  const orgs = useOrganizations(url);
  return orgs.map(({ avatar_url, login, description }) => (
    <div key={login} className="org">
      <h5>{login}</h5>
      <img src={avatar_url} alt={login} className="org-img" />
      <span>{description}</span>
    </div>
  ));
};

export const Card = ({ user }) => {
  const {
    avatar_url,
    login,
    name,
    bio,
    hireable,
    organizations_url,
    public_repos,
    followers
  } = useDevData(user);

  return (
    login && (
      <div className="card">
        <div className="about">
          <div className="about-img">
            <h5>{name}</h5>
            <img src={avatar_url} alt={login} />
            <p>{bio}</p>
          </div>
          <div className="about-desc">
            <p>
              <code>@{login}</code>
            </p>
            <p>Happily Employed? {hireable ? "No" : "Yes"}</p>
            <p>
              <code>{followers}</code> followers <br />{" "}
              <code>{public_repos}</code> public repos
            </p>
          </div>
        </div>
        <div className="organizations">
          <React.Suspense fallback={null}>
            <OrganizationsAvatars url={organizations_url} />
          </React.Suspense>
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
    _input.current.value = "";
    _input.current.blur();
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