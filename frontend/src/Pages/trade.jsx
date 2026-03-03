import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import NavBar from "../Components/NavBar/navBar";
import StockList from "../Components/StockList/stockList";
import TradeRoute from "../utils/tradeRoutes/TradeRoute";
import MobileNav from "../Components/NavBar/MobileNav/MobileNav";
import MobileWatchlistPage from "../Components/Mobile/MobileWatchlist/MobileWatchlistPage";
import Account from "./Trade/Accounts/Accounts";
import Order from "./Trade/Orders/Orders";
import Portfolio from "./Trade/Portfolio/PortFolio";
import Position from "./Trade/Positions/Positions";
import MobileStockDetails from "../Components/Mobile/MobileStockDetails/MobileStockDetails";
import MobileBuyOrder from "../Components/Mobile/MobileStockDetails/MobileOrder/MobileBuyOrder";
import MobileSellOrder from "../Components/Mobile/MobileStockDetails/MobileOrder/MobileSellOrder";
import OptionChainSection from "./Trade/TradeOne/OptionChainSection/OptionChainSection";
import ChartSection from "./Trade/TradeOne/ChartsSection/ChartSection";
import MobileStockManager from "../Components/Mobile/MobileWatchlist/MobileStockManager/MobileStockManager";
import Profile from "./Trade/Accounts/Profile/Profile";

function Trade() {
    const location = useLocation();
    const isStockDetailsPage = location.pathname.includes('stock-details') ||
        location.pathname.includes('buy-order') ||
        location.pathname.includes('sell-order') ||
        location.pathname.includes('option-chain') ||
        location.pathname.includes('chart') ||
        location.pathname.includes('manage-stocks');

    return (
        <div className="h-screen flex flex-col bg-[var(--bg-main)]">
            {/* Desktop View */}
            <div className="hidden md:flex flex-col h-full">
                <NavBar />
                <div className="flex flex-1 overflow-hidden p-2 gap-2">
                    <div className="w-1/4 h-full rounded-lg border border-[var(--border-primary)] overflow-hidden">
                        <StockList />
                    </div>
                    <div className="flex-1 bg-[var(--bg-main)] rounded-lg border border-[var(--border-primary)] overflow-hidden">
                        <TradeRoute />
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden flex flex-col h-full bg-[var(--bg-main)] overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <Routes>
                        <Route path="/" element={<Navigate to="watchlist" replace />} />
                        <Route path="watchlist" element={<MobileWatchlistPage />} />
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="orders" element={<Order />} />
                        <Route path="positions" element={<Position />} />
                        <Route path="accounts" element={<Account />} />
                        <Route path="stock-details" element={<MobileStockDetails />} />
                        <Route path="buy-order" element={<MobileBuyOrder />} />
                        <Route path="sell-order" element={<MobileSellOrder />} />
                        <Route path="option-chain" element={<OptionChainSection />} />
                        <Route path="chart" element={<ChartSection />} />
                        <Route path="manage-stocks" element={<MobileStockManager />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="*" element={<Navigate to="watchlist" replace />} />
                    </Routes>
                </div>
                {!isStockDetailsPage && <MobileNav />}
            </div>
        </div>
    );
}

export default Trade;
