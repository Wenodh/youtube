import { Provider } from "react-redux";
import "./App.css";
import Head from "./components/Head";
import Body from "./components/body/Body";
import store from "./utils/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainContainer from "./components/body/MainContainer";
import WatchPage from "./components/body/watchPage/WatchPage.js";
import ChannelPage from "./components/body/channelPage/ChannelPage.js"
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
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Body />,
    children: [
      {
        path: "/",
        element: <MainContainer />,
      },
      {
        path: "watch",
        element: <WatchPage />,
      },
      {
        path: "channel",
        element: <ChannelPage />,
      },
    ],
  },
]);
function App() {
  return (
    <Provider store={store}>
      <div className="">
        <Head />
        <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
}

export default App;
