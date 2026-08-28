import { useState } from 'react'
import { planProgress } from '../types/trainingPlan'
import type { Assignment, TrainingPlan } from '../types/trainingPlan'
import ProgressBar from './ProgressBar'
import StatusBadge from './StatusBadge'
import {
  PlanCardWrapper,
  PlanHeaderButton,
  PlanIndex,
  PlanMain,
  PlanTitle,
  PlanMeta,
  PlanSide,
  Chevron,
  AssignmentsPanel,
  AssignmentsPanelLabel,
  AssignmentRowStyled,
  AssignmentIndex,
  AssignmentInfo,
  AssignmentTitle,
  AssignmentSteps,
} from './PlanCard.styled'

function AssignmentRow({ assignment, index }: { assignment: Assignment; index: number }) {
  return (
    <AssignmentRowStyled>
      <AssignmentIndex>{String(index + 1).padStart(2, '0')}</AssignmentIndex>
      <AssignmentInfo>
        <AssignmentTitle $completed={assignment.completed}>{assignment.assignment_name}</AssignmentTitle>
        <AssignmentSteps>{assignment.numberOfSteps} steps</AssignmentSteps>
      </AssignmentInfo>
      <StatusBadge completed={assignment.completed} small />
    </AssignmentRowStyled>
  )
}

function PlanCard({
  plan,
  index,
  defaultOpen,
}: {
  plan: TrainingPlan
  index: number
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  const completedCount = plan.assignments.filter((a) => a.completed).length

  return (
    <PlanCardWrapper>
      <PlanHeaderButton type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <PlanIndex aria-hidden="true">{String(index + 1).padStart(2, '0')}</PlanIndex>

        <PlanMain>
          <PlanTitle>{plan.plan_name}</PlanTitle>
          <PlanMeta>
            {completedCount}/{plan.assignments.length} assignments
          </PlanMeta>
          <ProgressBar value={planProgress(plan)} completed={plan.completed} />
        </PlanMain>

        <PlanSide>
          <StatusBadge completed={plan.completed} />
          <Chevron $open={open} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Chevron>
        </PlanSide>
      </PlanHeaderButton>

      {open && (
        <AssignmentsPanel>
          <AssignmentsPanelLabel>Assignments</AssignmentsPanelLabel>
          {plan.assignments.map((assignment, i) => (
            <AssignmentRow key={assignment.assignment_id} assignment={assignment} index={i} />
          ))}
        </AssignmentsPanel>
      )}
    </PlanCardWrapper>
  )
}

export default PlanCard
