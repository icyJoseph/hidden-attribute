import React, { lazy, Suspense } from "react";

const Loading = () => <i className="nes-octocat animate" />;

export const LazyBitcoin = lazy(() => import("./containers/Bitcoin"));

export const LazyPokemon = lazy(() => import("./containers/Pokemon"));

export const LazyLanding = lazy(() => import("./containers/Landing"));

export function SuspenseLanding({ ...props }) {
  return (
    <Suspense fallback={<Loading />}>
      <LazyLanding {...props} />
    </Suspense>
  );
}

export function SuspenseBitcoin({ ...props }) {
  return (
    <Suspense fallback={<Loading />}>
      <LazyBitcoin {...props} />
    </Suspense>
  );
}

export function SuspensePokemon({ ...props }) {
  return (
    <Suspense fallback={<Loading />}>
      <LazyPokemon {...props} />
    </Suspense>
  );
}
