import { createBrowserRouter } from 'react-router-dom';
import ProtectRoute from '../components/layout/ProtectRoute';
import Sidebar from '../components/layout/Sidebar';
import CreateProduct from '../pages/CreateProduct';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import ProfilePage from '../pages/ProfilePage';
import SaleHistoryPage from '../pages/SaleHistoryPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProductManagePage from '../pages/managements/ProductManagePage';
import PurchaseManagementPage from '../pages/managements/PurchaseManagementPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import EditProfilePage from '../pages/EditProfilePage';
import StockManager from '../Custom User/StockManager';
import ChemicalsManagePage from '../pages/managements/ChemicalsManagePage';
import OrdersHistoryPage from '../pages/managements/OrdersHistoryPage';
import OrdersRequestPage from '../pages/managements/OrdersRequestPage';
import AddNewChemical from '../pages/AddNewChemical';
import GenerateNewOrder from '../pages/CreateNewOrder';
// import ProductInRackTable from '../components/warehouse/ProductInRackTable';
import { WarehouseManagementPage } from '../pages/managements/WarehouseManagementPage';
import StockTablePage from '../pages/StockTablePage';
import { RackDisplay } from '../pages/managements/RackDisplay';
import { StoreStockTable } from '../pages/StoreStockTable';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Sidebar />,
    children: [
      {
        path: '/',
        element: (
          <ProtectRoute>
            <Dashboard />
          </ProtectRoute>
        ),
      },
      {
        path: 'create-product',
        element: (
          <ProtectRoute>
            <CreateProduct />
          </ProtectRoute>
        ),
      },
      {
        path: 'create-order',
        element: (
          <ProtectRoute>
            <GenerateNewOrder />
          </ProtectRoute>
        ),
      },
      {
        path: 'add-chemical',
        element: (
          <ProtectRoute>
            <AddNewChemical />
          </ProtectRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectRoute>
            <ProfilePage />
          </ProtectRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectRoute>
            <ProductManagePage />
          </ProtectRoute>
        ),
      },
      {
        path: 'manage-chemicals',
        element: (
          <ProtectRoute>
            <ChemicalsManagePage />
          </ProtectRoute>
        ),
      },
      {
        path: 'orders-request',
        element: (
          <ProtectRoute>
            <OrdersRequestPage />
          </ProtectRoute>
        ),
      },
      {
        path: 'orders-history',
        element: (
          <ProtectRoute>
            <OrdersHistoryPage />
          </ProtectRoute>
        ),
      },
      {
        path: 'purchases',
        element: (
          <ProtectRoute>
            <PurchaseManagementPage />
          </ProtectRoute>
        ),
      },
      {
        path: 'sales-history',
        element: (
          <ProtectRoute>
            <SaleHistoryPage />
          </ProtectRoute>
        ),
      },
      {
        path: 'edit-profile',
        element: (
          <ProtectRoute>
            <EditProfilePage />
          </ProtectRoute>
        ),
      },
      {
        path: 'change-password',
        element: (
          <ProtectRoute>
            <ChangePasswordPage />
          </ProtectRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectRoute>
            <RegisterPage />
          </ProtectRoute>
        ),
      },

      // warehouse
      {
        path: '/warehouse-management',
        element: (
          <ProtectRoute>
            <WarehouseManagementPage />
          </ProtectRoute>
        ),
        children: [
          {
            index: true,
            element: <RackDisplay />,
          },
          {
            path: 'stock-table',
            element: <StockTablePage />,
          },
          {
            path: '/warehouse-management/inventory',
            element: (
              <ProtectRoute>
                <StoreStockTable onProductSelect={function (): void {
                  throw new Error('Function not implemented.');
                } }/>
              </ProtectRoute>
            ),
          }
        ],
      },
      
      // custom dummy content 
      {
        path: 'stock-manager',
        element: (
          <ProtectRoute>
            <StockManager/>
          </ProtectRoute>
        ),
      },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFound /> },
]);

