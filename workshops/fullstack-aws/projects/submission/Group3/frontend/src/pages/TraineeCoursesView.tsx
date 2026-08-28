import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import PlanCard from '../components/PlanCard'
import SearchBox from '../components/SearchBox'
import FilterTabs from '../components/FilterTabs'
import { TRAINING_PLANS } from '../data/mockTrainingData'
import { planProgress } from '../types/trainingPlan'
import type { TrainingPlan } from '../types/trainingPlan'
import {
  PageWrap,
  Eyebrow,
  Title,
  StatsGrid,
  StatTile,
  StatLabel,
  StatValue,
  StatSub,
  SearchFilterRow,
  ResultsCount,
  EmptyState,
  PlanList,
} from './AssignmentPage.styled'

type StatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'not-started', label: 'Not Started' },
]

function TraineeCoursesView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()

    return TRAINING_PLANS.reduce<{ plan: TrainingPlan; forceOpen: boolean }[]>((acc, plan) => {
      const progress = planProgress(plan)
      const planStatus = plan.completed ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'
      const statusMatch = statusFilter === 'all' || statusFilter === planStatus
      if (!statusMatch) return acc

      if (!q) {
        acc.push({ plan, forceOpen: false })
        return acc
      }

      const planMatch =
        plan.plan_id.toLowerCase().includes(q) || plan.plan_name.toLowerCase().includes(q)
      const matchingAssignments = plan.assignments.filter(
        (a) =>
          a.assignment_id.toLowerCase().includes(q) ||
          a.assignment_name.toLowerCase().includes(q),
      )

      if (planMatch) {
        acc.push({ plan, forceOpen: false })
      } else if (matchingAssignments.length > 0) {
        acc.push({ plan: { ...plan, assignments: matchingAssignments }, forceOpen: true })
      }

      return acc
    }, [])
  }, [search, statusFilter])

  const totalPlans = TRAINING_PLANS.length
  const completedPlans = TRAINING_PLANS.filter((p) => p.completed).length
  const allAssignments = TRAINING_PLANS.flatMap((p) => p.assignments)
  const totalAssignments = allAssignments.length
  const completedAssignments = allAssignments.filter((a) => a.completed).length
  const activePlans = TRAINING_PLANS.filter((p) => !p.completed && planProgress(p) > 0).length
  const overallPercent =
    totalAssignments === 0 ? 0 : Math.round((completedAssignments / totalAssignments) * 100)

  const stats = [
    { label: 'Plans', value: `${completedPlans}/${totalPlans}`, sub: 'completed' },
    { label: 'Assignments', value: `${completedAssignments}/${totalAssignments}`, sub: 'completed' },
    { label: 'Overall', value: `${overallPercent}%`, sub: 'progress' },
    { label: 'Active', value: `${activePlans}`, sub: 'plans in progress' },
  ]

  return (
    <Layout>
      <PageWrap>
        <header>
          <Eyebrow>Training Portal</Eyebrow>
          <Title>My Training Plans</Title>

          <StatsGrid>
            {stats.map((stat) => (
              <StatTile key={stat.label}>
                <StatLabel>{stat.label}</StatLabel>
                <StatValue>{stat.value}</StatValue>
                <StatSub>{stat.sub}</StatSub>
              </StatTile>
            ))}
          </StatsGrid>
        </header>

        <SearchFilterRow>
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search plans or assignments…"
            ariaLabel="Search training plans or assignments"
          />
          <FilterTabs
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
            ariaLabel="Filter by status"
          />
        </SearchFilterRow>

        {(search || statusFilter !== 'all') && (
          <ResultsCount>
            {filtered.length} {filtered.length === 1 ? 'plan' : 'plans'} found
          </ResultsCount>
        )}

        {filtered.length === 0 ? (
          <EmptyState>No training plans match your search.</EmptyState>
        ) : (
          <PlanList>
            {filtered.map(({ plan, forceOpen }, index) => (
              <PlanCard
                key={plan.plan_id + (forceOpen ? '-open' : '-closed')}
                plan={plan}
                index={index}
                defaultOpen={forceOpen}
              />
            ))}
          </PlanList>
        )}
      </PageWrap>
    </Layout>
  )
}

export default TraineeCoursesView
