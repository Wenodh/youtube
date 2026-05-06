import { Provider } from "react-redux";
import "./App.css";
import Head from "./components/Head";
import Body from "./components/body/Body";
import store from "./utils/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainContainer from "./components/body/MainContainer";
import WatchPage from "./components/body/watchPage/WatchPage.js";
import ChannelPage from "./components/body/channelPage/ChannelPage.js";
import UnderConstruction from "./components/UnderConstruction.js";
import ShortsPage from "./components/body/ShortsPage.js";
/**
 *
 * Head
 * Body
 *    SideBar
 *        MenuItems
 *    MainContainer
 *        TagsList
 *        VideoContainer
 *            VideoCard
 */
// const head = <Head />;
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Head />
        <Body />
      </>
    ),
    errorElement: <UnderConstruction />,
    children: [
      {
        path: "/",
        element: (
          <>
            <MainContainer />
          </>
        ),
      },
      {
        path: "shorts",
        element: <ShortsPage />,
      },
      {
        path: "watch",
        element: (
          <>
            <WatchPage />
          </>
        ),
      },
      {
        path: "channel",
        element: (
          <>
            <ChannelPage />
          </>
        ),
      },
      {
        path: "underconstruction",
        element: <UnderConstruction />,
      },
    ],
  },
]);
function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  );
}

export default App;
