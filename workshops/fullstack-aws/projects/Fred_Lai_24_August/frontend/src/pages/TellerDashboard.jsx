// Main dashboard for authenticated tellers.
// Provides customer lookup, account viewing, deposits, withdrawals, and other teller operations.

import { useRef, useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import TellerCustomerSearch from '../features/teller/TellerCustomerSearch'
import TellerAccountList from '../features/teller/TellerAccountList'
import TellerCreateAccountForm from '../features/teller/TellerCreateAccountForm'
import TellerEditCustomerForm from '../features/teller/TellerEditCustomerForm'
import TellerTransactionHistory from '../features/teller/TellerTransactionHistory'
import TellerDepositForm from '../features/teller/TellerDepositForm'
import TellerWithdrawForm from '../features/teller/TellerWithdrawForm'

// Sidebar nav keys without a route path (see DashboardSidebar's teller menu)
// scroll to the matching section instead of navigating. "support" has no
// section yet, so it's a no-op until that feature exists.
const SECTION_REFS_BY_KEY = {
  customers: 'customerSection',
  accounts: 'accountsSection',
  'create-account': 'accountsSection',
  transactions: 'accountSection',
}

function TellerDashboard() {
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)
  // Bumped after any mutation (deposit/withdraw/create account) so the
  // account list and transaction history remount and refetch fresh data.
  const [version, setVersion] = useState(0)

  const customerSectionRef = useRef(null)
  const accountsSectionRef = useRef(null)
  const accountSectionRef = useRef(null)
  const sectionRefs = {
    customerSection: customerSectionRef,
    accountsSection: accountsSectionRef,
    accountSection: accountSectionRef,
  }

  function handleSelectCustomer(customer) {
    setSelectedCustomer(customer)
    setSelectedAccount(null)
  }

  function handleMutationSuccess() {
    setVersion((v) => v + 1)
  }

  function handleNavigate(key) {
    const refName = SECTION_REFS_BY_KEY[key]
    sectionRefs[refName]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar onNavigate={handleNavigate} />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Teller Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Search and manage customer accounts.</p>
        </div>

        <div className="space-y-8">
          <section ref={customerSectionRef} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Find a Customer</h2>
            <TellerCustomerSearch onSelectCustomer={handleSelectCustomer} />
          </section>

          {selectedCustomer && (
            <section ref={accountsSectionRef} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#062b4f] text-sm font-semibold text-white">
                  {(selectedCustomer.first_name?.[0] ?? '') + (selectedCustomer.last_name?.[0] ?? '')}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {selectedCustomer.first_name} {selectedCustomer.last_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Customer ID: {selectedCustomer.id} · {selectedCustomer.email}
                  </p>
                </div>
              </div>
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
            <section ref={accountSectionRef} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
    </div>
  )
}

export default TellerDashboard
