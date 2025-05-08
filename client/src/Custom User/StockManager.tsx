import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import OrderRequest from "../Custom User/OrderRequest";
import HistoryOrderRequest from "../Custom User/HistoryOrderRequest";
import Profile from "../Custom User/Profile";

const StockManager = () => {
  return (
    <>
      <div className="flex h-screen text-white bg-gray-900">
        {/* Sidebar */}
        <aside className="flex flex-col justify-between w-64 p-4 bg-gray-800">
          <div>
            <h1 className="mb-6 text-xl font-bold text-center">LOGO</h1>
            <nav className="flex flex-col space-y-2">
              <NavLink to="/OrderRequest" className="p-3 bg-gray-700 rounded hover:bg-gray-600">Order Request</NavLink>
              <NavLink to="/history" className="p-3 bg-gray-700 rounded hover:bg-gray-600">History Order Request</NavLink>
              <NavLink to="/profile" className="p-3 bg-gray-700 rounded hover:bg-gray-600">Profile</NavLink>
            </nav>
          </div>
          <button className="p-3 bg-red-600 rounded hover:bg-red-500">Logout</button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<OrderRequest />} />
            <Route path="/history" element={<HistoryOrderRequest />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default StockManager;

