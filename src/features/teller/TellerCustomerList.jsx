// Renders a list of customers and reports selection back to the caller.
// Uses a plain table for now — swap for the shared Table component once
// it lands, the props/behavior below won't need to change.

import Button from '../../components/Button'

function TellerCustomerList({ customers, onSelectCustomer }) {
  if (customers.length === 0) {
    return <p className="text-sm text-slate-500">No customers found.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200 text-slate-500">
          <th className="py-2 px-3 font-medium">Name</th>
          <th className="py-2 px-3 font-medium">Email</th>
          <th className="py-2 px-3 font-medium">DOB</th>
          <th className="py-2 px-3"></th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
            <td className="py-2 px-3">{customer.first_name} {customer.last_name}</td>
            <td className="py-2 px-3">{customer.email}</td>
            <td className="py-2 px-3">{customer.dob}</td>
            <td className="py-2 px-3">
              <Button type="button" onClick={() => onSelectCustomer(customer)}>
                Select
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TellerCustomerList
