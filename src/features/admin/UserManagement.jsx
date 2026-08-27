function UserManagement() {
    return (
        <section className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">
                        User Management
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        Manage customers, tellers, and administrators.
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-md px-4 py-2 font-medium"
                >
                    Create User
                </button>
            </div>

            <div className="mb-6 flex gap-3">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full rounded-md border px-4 py-2"
                />

                <select
                    className="rounded-md border px-4 py-2"
                    defaultValue="all"
                >
                    <option value="all">All Roles</option>
                    <option value="customer">Customers</option>
                    <option value="teller">Tellers</option>
                    <option value="admin">Administrators</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 font-semibold">
                                Name
                            </th>

                            <th className="px-4 py-3 font-semibold">
                                Email
                            </th>

                            <th className="px-4 py-3 font-semibold">
                                Role
                            </th>

                            <th className="px-4 py-3 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-3">
                                Example User
                            </td>

                            <td className="px-4 py-3">
                                example@bank.com
                            </td>

                            <td className="px-4 py-3">
                                Customer
                            </td>

                            <td className="px-4 py-3">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="rounded-md border px-3 py-1"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-md border px-3 py-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default UserManagement;