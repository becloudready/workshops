import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CustomerLayout } from './components/layout/CustomerLayout'
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage'
import { AccountPage } from './pages/customer/AccountPage'
import { DashboardPage } from './pages/customer/DashboardPage'
import { DepositPage } from './pages/customer/DepositPage'
import { ProfilePage } from './pages/customer/ProfilePage'
import { TransferPage } from './pages/customer/TransferPage'
import { LandingPage } from './pages/auth/LandingPage'
import { SignupPage } from './pages/auth/SignupPage'
import './App.css'

function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route element={<CustomerLayout />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/account/:accountNumber" element={<AccountPage />} />
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/transfer" element={<TransferPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="/admin/accounts" element={<AdminAccountsPage />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes></BrowserRouter>
}

export default App
