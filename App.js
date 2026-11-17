import { Provider } from "react-redux";
import "./App.css";
import Head from "./components/Head";
import Body from "./components/body/Body";
import store from "./utils/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import MainContainer from "./components/body/MainContainer";
import WatchPage from "./components/body/watchPage/WatchPage.js";
import ChannelPage from "./components/body/channelPage/ChannelPage.js";
import UnderConstruction from "./components/UnderConstruction.js";
import ShortsPage from "./components/body/ShortsPage.js";
import Library from "./components/body/Library.js";
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
        path: "library",
        element: <Library />,
      },
      {
        path: "history",
        element: <Library type="history" />,
      },
      {
        path: "watchlater",
        element: <Library type="watchlater" />,
      },
      {
        path: "liked",
        element: <Library type="liked" />,
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
function AppContent() {
  const isDarkMode = useSelector((store) => store.app.isDarkMode);
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="bg-white text-black dark:bg-[#0f0f0f] dark:text-white min-h-screen">
        <RouterProvider router={appRouter} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
