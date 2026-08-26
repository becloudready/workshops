// Main dashboard for authenticated tellers.
// Provides customer lookup, account viewing, deposits, withdrawals, and other teller operations.

import { useState } from 'react'
import TellerCustomerSearch from '../features/teller/TellerCustomerSearch'
import TellerAccountList from '../features/teller/TellerAccountList'
import TellerCreateAccountForm from '../features/teller/TellerCreateAccountForm'
import TellerEditCustomerForm from '../features/teller/TellerEditCustomerForm'
import TellerTransactionHistory from '../features/teller/TellerTransactionHistory'
import TellerDepositForm from '../features/teller/TellerDepositForm'
import TellerWithdrawForm from '../features/teller/TellerWithdrawForm'

function TellerDashboard() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  // Bumped after any mutation (deposit/withdraw/create account) so the
  // account list and transaction history remount and refetch fresh data.
  const [version, setVersion] = useState(0)

  function handleSelectCustomer(customer) {
    setSelectedCustomer(customer)
    setSelectedAccount(null)
  }

  function handleMutationSuccess() {
    setVersion((v) => v + 1)
  }

  return (
    <div>
      <h2>Teller Dashboard</h2>

      <section>
        <h3>Find a Customer</h3>
        <TellerCustomerSearch onSelectCustomer={handleSelectCustomer} />
      </section>

      {selectedCustomer && (
        <section>
          <h3>
            Accounts — {selectedCustomer.first_name} {selectedCustomer.last_name}
          </h3>
          <TellerAccountList
            key={`${selectedCustomer.id}-${version}`}
            customer={selectedCustomer}
            onSelectAccount={setSelectedAccount}
          />
          <TellerCreateAccountForm
            customer={selectedCustomer}
            onSuccess={handleMutationSuccess}
          />
          <TellerEditCustomerForm
            key={selectedCustomer.id}
            customer={selectedCustomer}
            onSuccess={setSelectedCustomer}
          />
        </section>
      )}

      {selectedAccount && (
        <section>
          <h3>Account #{selectedAccount.id}</h3>
          <TellerDepositForm
            accountId={selectedAccount.id}
            onSuccess={handleMutationSuccess}
          />
          <TellerWithdrawForm
            accountId={selectedAccount.id}
            onSuccess={handleMutationSuccess}
          />
          <TellerTransactionHistory
            key={`${selectedAccount.id}-${version}`}
            account={selectedAccount}
          />
        </section>
      )}
    </div>
  )
}

export default TellerDashboard
