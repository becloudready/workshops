import UserManagement from "../features/admin/UserManagement";
import AccountManagement from "../features/admin/AccountManagement";

function AdminDashboard() {
  return (
    <div className="min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="mt-2 text-gray-600">Manage users, staff, and accounts.</p>
      </div>

      <div className="space-y-8">
        <UserManagement />

        <AccountManagement />
      </div>
    </div>
  );
}

export default AdminDashboard;
