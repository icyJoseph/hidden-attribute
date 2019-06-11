# Hidden Attribute

Demonstrates how to take advatange of the HTML attribute `hidden`.

## Demo

Demo available [here](https://hidden-attribute.surge.sh/).

## About

This repository exists for educational purposes only.

It uses [nes.css](https://nostalgic-css.github.io/NES.css/) as styling library.

It uses [Parcel](https://parceljs.org/) to bundle the application.

Consumes data from [CoinDesk](https://www.coindesk.com/api) and [PokeApi](https://pokeapi.co/).

## Explanation

Every time a React component mounts, updates or is unmounted, React executes two phases:

- A render phase 📖
- And a commit phase 📝

There is a cause-effect relation between these, however, when Concurrent Mode comes out, you'll be able to opt-in to have many render phases before a commit phase actually kicks in. The actual details of this are not clear, so do not think about them just yet.

During the commit phase React makes changes to the DOM, after this, the [Browser's job](https://developers.google.com/web/fundamentals/performance/rendering/) is to apply CSS styles, layout calculations, paint pixels and compose your elements into layers.

That's a lot of work!

Luckily, there is a DOM attribute called `hidden`, which you can use to get React to commit changes to the DOM, while also telling the browser not to run its own work, just yet.

It is equivalent to display none, in fact, setting a display property on hidden elements overrides the attribute!

Even though [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden) recommends not to use hidden to hide panels, it is a great example to show how to take advantage of this attribute.

In this demo, there are three tabs:

- The Landing tab, simply displays a message.
- The Bitcoin tab, loads data from [CoinDesk](https://www.coindesk.com/api) and shows it in a [Victory Chart](https://formidable.com/open-source/victory/docs).
- The Pokémon tab, loads Pokémon from [PokeApi](https://pokeapi.co/) and shows their sprites.

Each tab is a separate `JavaScript` bundle thanks to React's lazy. Since the `Bitcoin` tab uses `Victory` Charts, this bundle is bound to be heavy and will most likely load last. The demo also uses [Parcel](https://parceljs.org) to bundle the whole application with zero configuration.

As soon as the page loads, the three bundles are fetched. Because the demo uses `lazy + Suspense`, at this point, all three tabs do a `fallback`. As far as the `Tabs` handler is concerned, the job is done, React is now handling the asynchronous loading.

After each bundle is loaded, it is parsed, then the actual component is mounted and its own life cycles methods are executed. On mount, the landing page does nothing special, however, in the Pokemon tab, `fire` type Pokémons are queried, and in the bitcoin tab a request for the BTC/SEK rate during the last month is created.

All of this is done before the user has switched tabs. Most likely, it all happens as they read the landing page message.

To see that the browser is not actually spending resources in loading hidden elements, in the Pokémon tab, elements with an even index order load their Pokémon sprite as `CSS` background, while the ones with an odd index load the sprite as an `img` HTML element.

Now one can observe that React commits its work to the DOM, and Pokémon with odd indeces fetch the `src` attribute in the `img` element, but Pokémon with even indeces do not, because it is CSS and the hidden attribute tells the browser to not run it's work chain, just yet.

Open the network tab in your browser dev tools to see for yourself, as soon as you switch to the Pokémon tab, the even indeces images are fetched. Notice that the Bitcoin data is also fetched upon page loading.

What if you switch tabs quickly? You'll either see the `fallback`, or simply see your rendered component.

## Implementation

At the root of the React three in the demo we have:

```jsx
function Tab({ title, children }) {
  return (
    <>
      <h3>{title}</h3>
      <div>{children}</div>
    </>
  );
}

function App() {
  return (
    <Tabs>
      <Tab label={<LandingLabel />} title="Landing">
        <SuspenseLanding />
      </Tab>
      <Tab label={<BitCoinLabel />} title="Bitcoin">
        <SuspenseBitcoin />
      </Tab>
      <Tab label={<PokemonLabel />} title="Pokemon">
        <SuspensePokemon />
      </Tab>
    </Tabs>
  );
}
```

Where the `lazy + Suspense` are defined like so:

```jsx
const LazyLanding = React.lazy(() => import("./containers/Landing"));

function SuspenseLanding({ ...props }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyLanding {...props} />
    </React.Suspense>
  );
}
```

To implement the desired behavior, write the `Tab` handler as such:

```jsx
function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(children, ({ props: { label } }, index) => (
        <button key={index} onClick={() => setCurrent(index)}>
          {label}
        </button>
      )),
    []
  );

  return (
    <>
      <div>{controls}</div>
      {React.Children.toArray(children).map((child, index) => (
        <div key={index} hidden={index !== current}>
          {child}
        </div>
      ))}
    </>
  );
}
```

This approach, begins the async `lazy + Suspense` loading of each tab, and then renders and commits each children to the DOM. However, those not currently selected children are `hidden` in the DOM, only the current is displayed.

Another approach is to:

```jsx
function Tabs({ children }) {
  const [current, setCurrent] = React.useState(0);

  const controls = React.useMemo(
    () =>
      React.Children.map(children, ({ props: { label } }, index) => (
        <button key={index} onClick={() => setCurrent(index)}>
          {label}
        </button>
      )),
    []
  );

  return (
    <>
      <div>{controls}</div>
      {React.Children.toArray(children).map(
        (child, index) => index === current && <div key={index}>{child}</div>
      )}
    </>
  );
}
```

Unfortunately, this actually prevents the tabs from being `lazy + Suspense` loaded, rendered and commited to the DOM by React. With this implementation, switching tabs triggers the `fallback` on Suspense, and will make users wait until it resolves, renders and commits to the DOM, after which data is fetched and updates the component, triggering render and commit once again.

The code for this demo lives in this [repository](https://github.com/icyJoseph/hidden-attribute).

Enjoy!
