import { useMemo, useState } from 'react'
import SearchBox from '../../components/SearchBox'
import FilterTabs from '../../components/FilterTabs'
import PlanCard from '../../components/PlanCard'
import { Toolbar } from '../../components/Toolbar.styled'
import { TRAINING_PLANS } from '../../data/mockTrainingData'
import { EmptyState, PlanList, ResultsCount } from '../AssignmentPage.styled'

type CourseFilter = 'all' | 'completed' | 'in-progress'

const FILTER_OPTIONS: { value: CourseFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

function CoursesPanel() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<CourseFilter>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return TRAINING_PLANS.filter((plan) => {
      const matchSearch =
        !q ||
        plan.plan_name.toLowerCase().includes(q) ||
        plan.plan_id.toLowerCase().includes(q) ||
        plan.assignments.some((a) => a.assignment_name.toLowerCase().includes(q))
      const matchFilter =
        filter === 'all' ||
        (filter === 'completed' && plan.completed) ||
        (filter === 'in-progress' && !plan.completed)
      return matchSearch && matchFilter
    })
  }, [search, filter])

  return (
    <div>
      <Toolbar>
        <SearchBox value={search} onChange={setSearch} placeholder="Search by plan name or assignment…" />
        <FilterTabs options={FILTER_OPTIONS} value={filter} onChange={setFilter} ariaLabel="Filter by status" />
      </Toolbar>

      {(search || filter !== 'all') && (
        <ResultsCount>
          {filtered.length} plan{filtered.length !== 1 ? 's' : ''} found
        </ResultsCount>
      )}

      {filtered.length === 0 ? (
        <EmptyState>No training plans match your search.</EmptyState>
      ) : (
        <PlanList>
          {filtered.map((plan, index) => (
            <PlanCard key={plan.plan_id} plan={plan} index={index} />
          ))}
        </PlanList>
      )}
    </div>
  )
}

export default CoursesPanel
