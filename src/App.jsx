// App.jsx

import BottomBar from "./componens/Bottombar";
import Navbar from "./componens/Navbar";
import { useIsMobile } from "./ifMobile";

export default function App(props) {
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile() ? (
        <div class="flex items-center justify-center h-screen text-center px-4 bg-white text-gray-800 font-sans">
          <p class="text-lg font-semibold">
            Please switch to a mobile screen to use this app.
          </p>
        </div>
      ) : (
        <div class="font-sans bg-gray-50 min-h-screen">
          <Navbar />
          {props.children}
          <BottomBar />
        </div>
      )}
    </>
  );
}