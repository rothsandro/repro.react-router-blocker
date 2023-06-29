import * as React from "react";
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction,
} from "react-router-dom";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  RouterProvider,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<h2>Index</h2>} />
      <Route path="one" element={<h2>One</h2>} />
      <Route path="two" element={<h2>Two</h2>} />
      <Route path="three" element={<h2>three</h2>} />
      <Route path="four" element={<h2>four</h2>} />
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}

function Layout() {
  return (
    <>
      <h1>Navigation Blocking Example</h1>
      <nav>
        <Link to="/">Index</Link>&nbsp;&nbsp;
        <Link to="/one">One</Link>&nbsp;&nbsp;
        <Link to="/two">Two</Link>&nbsp;&nbsp;
        <Link to="/three">Three</Link>&nbsp;&nbsp;
        <Link to="/four">Four</Link>&nbsp;&nbsp;
      </nav>
      <Outlet />
      <BlockerComponent />
    </>
  );
}

function BlockerComponent() {
  const shouldBlock = React.useCallback<BlockerFunction>(() => {
    console.log("shouldBlock has been called");
    return true;
  }, []);

  const blocker = useBlocker(shouldBlock);

  return <>{blocker ? <ConfirmNavigation blocker={blocker} /> : null}</>;
}

function ConfirmNavigation({ blocker }: { blocker: Blocker }) {
  if (blocker.state === "blocked") {
    return (
      <>
        <p style={{ color: "red" }}>
          Blocked the last navigation to {blocker.location.pathname}
        </p>
        <button onClick={() => blocker.proceed?.()}>Let me through</button>
        <button onClick={() => blocker.reset?.()}>Keep me here</button>
      </>
    );
  }

  if (blocker.state === "proceeding") {
    return (
      <p style={{ color: "orange" }}>Proceeding through blocked navigation</p>
    );
  }

  return <p style={{ color: "green" }}>Blocker is currently unblocked</p>;
}
