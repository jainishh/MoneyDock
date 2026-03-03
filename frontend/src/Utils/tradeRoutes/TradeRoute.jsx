import Account from "../../Pages/Trade/Accounts/Accounts";
import Order from "../../Pages/Trade/Orders/Orders";
import Portfolio from "../../Pages/Trade/Portfolio/PortFolio";
import Position from "../../Pages/Trade/Positions/Positions";
import TradeOne from "../../Pages/Trade/TradeOne/TradeOne";
import Profile from "../../Pages/Trade/Accounts/Profile/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
function TradeRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="watchlist" replace />} />
      <Route path="watchlist" element={<TradeOne />} />
      <Route path="accounts" element={<Account />} />
      <Route path="orders" element={<Order />} />
      <Route path="portfolio" element={<Portfolio />} />
      <Route path="positions" element={<Position />} />
      <Route path="profile" element={<Profile />} />
    </Routes>
  );
}
export default TradeRoute;
