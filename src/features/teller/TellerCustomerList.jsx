// Renders a list of customers and reports selection back to the caller.
// Uses plain elements for now — swap for the shared Table component once
// it lands, the props/behavior below won't need to change.

function TellerCustomerList({ customers, onSelectCustomer }) {
  if (customers.length === 0) {
    return <p>No customers found.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>DOB</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.first_name} {customer.last_name}</td>
            <td>{customer.email}</td>
            <td>{customer.dob}</td>
            <td>
              <button type="button" onClick={() => onSelectCustomer(customer)}>
                Select
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TellerCustomerList
