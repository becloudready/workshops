import { useMemo, useState } from 'react'
import SearchBox from '../../components/SearchBox'
import FilterTabs from '../../components/FilterTabs'
import StatusBadge from '../../components/StatusBadge'
import ProgressBar from '../../components/ProgressBar'
import DataTable from '../../components/DataTable'
import { Toolbar } from '../../components/Toolbar.styled'
import { Tag } from '../../components/Tag.styled'
import { TRAINEES } from '../../data/mockTrainingData'
import { planProgress } from '../../types/trainingPlan'
import type { TrainingPlan } from '../../types/trainingPlan'
import type { Trainee } from '../../types/trainee'
import {
  ResultsCount,
  Row,
  Td,
  IdText,
  UsernameText,
  EmailText,
  ProgressCell,
  ProgressCellNote,
  ChevronCell,
  Chevron,
  ExpandedCell,
  ExpandedInner,
  ExpandedLabel,
  EmptyNote,
  PlanRows,
  PlanRow,
  PlanRowHeader,
  PlanRowMain,
  PlanRowName,
  PlanRowSide,
  PlanAssignmentRow,
  PlanAssignmentIndex,
  PlanAssignmentName,
  PlanAssignmentSteps,
} from './TraineesPanel.styled'

const COLUMNS = ['User ID', 'Username', 'Email', 'Role', 'Training Progress', '']

type TraineeFilter = 'all' | 'enrolled' | 'not-enrolled'

const FILTER_OPTIONS: { value: TraineeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'not-enrolled', label: 'Not Enrolled' },
]

function TraineePlanRow({ plan }: { plan: TrainingPlan }) {
  const [open, setOpen] = useState(false)
  const progress = planProgress(plan)

  return (
    <PlanRow>
      <PlanRowHeader type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <PlanRowMain>
          <PlanRowName>{plan.plan_name}</PlanRowName>
          <ProgressBar value={progress} completed={plan.completed} mini />
        </PlanRowMain>
        <PlanRowSide>
          <StatusBadge completed={plan.completed} small />
          <Chevron $open={open} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Chevron>
        </PlanRowSide>
      </PlanRowHeader>
      {open &&
        plan.assignments.map((assignment, i) => (
          <PlanAssignmentRow key={assignment.assignment_id}>
            <PlanAssignmentIndex>{String(i + 1).padStart(2, '0')}</PlanAssignmentIndex>
            <PlanAssignmentName $completed={assignment.completed}>
              {assignment.assignment_name}
            </PlanAssignmentName>
            <PlanAssignmentSteps>{assignment.numberOfSteps} steps</PlanAssignmentSteps>
            <StatusBadge completed={assignment.completed} small />
          </PlanAssignmentRow>
        ))}
    </PlanRow>
  )
}

function TraineeRow({
  trainee,
  selected,
  onSelect,
}: {
  trainee: Trainee
  selected: boolean
  onSelect: () => void
}) {
  const totalPlans = trainee.training_progress.length
  const completedPlans = trainee.training_progress.filter((p) => p.completed).length
  const allAssignments = trainee.training_progress.flatMap((p) => p.assignments)
  const overallProgress =
    allAssignments.length > 0
      ? Math.round((allAssignments.filter((a) => a.completed).length / allAssignments.length) * 100)
      : 0

  return (
    <>
      <Row $selected={selected} onClick={onSelect}>
        <Td>
          <IdText>{trainee.user_id}</IdText>
        </Td>
        <Td>
          <UsernameText>{trainee.username}</UsernameText>
        </Td>
        <Td>
          <EmailText>{trainee.email}</EmailText>
        </Td>
        <Td>
          <Tag>{trainee.role}</Tag>
        </Td>
        <Td>
          {totalPlans === 0 ? (
            <IdText>—</IdText>
          ) : (
            <ProgressCell>
              <ProgressBar value={overallProgress} completed={overallProgress === 100} mini />
              <ProgressCellNote>
                {completedPlans}/{totalPlans} plans
              </ProgressCellNote>
            </ProgressCell>
          )}
        </Td>
        <ChevronCell>
          <Chevron $open={selected} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Chevron>
        </ChevronCell>
      </Row>
      {selected && (
        <tr>
          <ExpandedCell colSpan={6}>
            <ExpandedInner>
              <ExpandedLabel>Training Progress &mdash; {trainee.username}</ExpandedLabel>
              {trainee.training_progress.length === 0 ? (
                <EmptyNote>No training plans enrolled.</EmptyNote>
              ) : (
                <PlanRows>
                  {trainee.training_progress.map((plan) => (
                    <TraineePlanRow key={plan.plan_id} plan={plan} />
                  ))}
                </PlanRows>
              )}
            </ExpandedInner>
          </ExpandedCell>
        </tr>
      )}
    </>
  )
}

function TraineesPanel() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<TraineeFilter>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return TRAINEES.filter((t) => {
      const matchSearch =
        !q ||
        t.username.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.user_id.toLowerCase().includes(q)
      const matchFilter =
        filter === 'all' ||
        (filter === 'enrolled' && t.training_progress.length > 0) ||
        (filter === 'not-enrolled' && t.training_progress.length === 0)
      return matchSearch && matchFilter
    })
  }, [search, filter])

  return (
    <div>
      <Toolbar>
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search by username, email, or ID…"
        />
        <FilterTabs
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
          ariaLabel="Filter by enrollment"
        />
      </Toolbar>

      {(search || filter !== 'all') && (
        <ResultsCount>
          {filtered.length} trainee{filtered.length !== 1 ? 's' : ''} found
        </ResultsCount>
      )}

      <DataTable columns={COLUMNS} isEmpty={filtered.length === 0} emptyMessage="No trainees match your search.">
        {filtered.map((trainee) => (
          <TraineeRow
            key={trainee.user_id}
            trainee={trainee}
            selected={selectedId === trainee.user_id}
            onSelect={() => setSelectedId(selectedId === trainee.user_id ? null : trainee.user_id)}
          />
        ))}
      </DataTable>
    </div>
  )
}

export default TraineesPanel
