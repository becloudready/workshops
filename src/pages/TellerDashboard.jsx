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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Teller Dashboard</h1>
      </div>

      <div className="space-y-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Find a Customer</h2>
          <TellerCustomerSearch onSelectCustomer={handleSelectCustomer} />
        </section>

        {selectedCustomer && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Accounts — {selectedCustomer.first_name} {selectedCustomer.last_name}
            </h2>
            <TellerAccountList
              key={`${selectedCustomer.id}-${version}`}
              customer={selectedCustomer}
              onSelectAccount={setSelectedAccount}
            />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <TellerCreateAccountForm
                customer={selectedCustomer}
                onSuccess={handleMutationSuccess}
              />
              <TellerEditCustomerForm
                key={selectedCustomer.id}
                customer={selectedCustomer}
                onSuccess={setSelectedCustomer}
              />
            </div>
          </section>
        )}

        {selectedAccount && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Account #{selectedAccount.id}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <TellerDepositForm
                accountId={selectedAccount.id}
                onSuccess={handleMutationSuccess}
              />
              <TellerWithdrawForm
                accountId={selectedAccount.id}
                onSuccess={handleMutationSuccess}
              />
            </div>
            <div className="mt-6">
              <TellerTransactionHistory
                key={`${selectedAccount.id}-${version}`}
                account={selectedAccount}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default TellerDashboard
