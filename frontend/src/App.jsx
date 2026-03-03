import { BrowserRouter, Routes, Route } from "react-router-dom";
import Trade from "./Pages/trade.jsx";
import LandingRoute from "./utils/LandingRoute/LandingRoute.jsx";
import { SocketProvider } from "./context/SocketContext";

import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FontSizeProvider } from "./context/FontSizeContext";

function App() {
  return (
    <FontSizeProvider>
      <ThemeProvider>
        <ToastProvider>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/trade/*" element={<Trade />} />
                <Route path="/*" element={<LandingRoute />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </ToastProvider>
      </ThemeProvider>
    </FontSizeProvider>
  );
}

export default App
