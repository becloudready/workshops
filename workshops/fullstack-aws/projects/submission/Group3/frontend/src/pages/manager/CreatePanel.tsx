import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormGroup, Label, Input, Select, SubmitButton } from '../../components/Form.styled'
import { ASSIGNMENTS, TRAINEES, TRAINING_PLANS } from '../../data/mockTrainingData'
import {
  CreatePanelWrap,
  FormStack,
  TabSwitch,
  TabButton,
  TabDescription,
  ChecklistWrap,
  ChecklistItem,
  ChecklistItemInfo,
  ChecklistItemTitle,
  ChecklistItemSub,
  ChecklistItemId,
  SelectedCount,
} from './CreatePanel.styled'

type CreationTab = 'plan' | 'assignment' | 'enroll'

const TABS: { value: CreationTab; label: string; description: string }[] = [
  { value: 'plan', label: 'Training Plan', description: 'Create a new training plan and attach assignments to it.' },
  { value: 'assignment', label: 'Assignment', description: 'Define a new assignment with a set number of steps.' },
  { value: 'enroll', label: 'Enroll Trainees', description: 'Enroll one or more trainees into an existing training plan.' },
]

function useToggleSet() {
  const [selected, setSelected] = useState<string[]>([])
  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }
  return { selected, toggle, reset: () => setSelected([]) }
}

function CreatePlanForm() {
  const [planName, setPlanName] = useState('')
  const { selected, toggle, reset } = useToggleSet()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!planName.trim() || selected.length === 0) return
    setSubmitted(true)
    setTimeout(() => {
      setPlanName('')
      reset()
      setSubmitted(false)
    }, 2000)
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="plan-name">Plan Name</Label>
        <Input
          id="plan-name"
          type="text"
          value={planName}
          onChange={(event) => setPlanName(event.target.value)}
          placeholder="e.g. Advanced Python Track"
        />
      </FormGroup>

      <FormGroup>
        <Label as="span">Assignments</Label>
        <ChecklistWrap>
          {ASSIGNMENTS.map((assignment) => (
            <ChecklistItem key={assignment.assignment_id} $checked={selected.includes(assignment.assignment_id)}>
              <input
                type="checkbox"
                checked={selected.includes(assignment.assignment_id)}
                onChange={() => toggle(assignment.assignment_id)}
              />
              <ChecklistItemInfo>
                <ChecklistItemTitle>{assignment.assignment_name}</ChecklistItemTitle>
                <ChecklistItemSub>{assignment.numberOfSteps} steps</ChecklistItemSub>
              </ChecklistItemInfo>
              <ChecklistItemId>{assignment.assignment_id}</ChecklistItemId>
            </ChecklistItem>
          ))}
        </ChecklistWrap>
        {selected.length > 0 && (
          <SelectedCount>
            {selected.length} assignment{selected.length !== 1 ? 's' : ''} selected
          </SelectedCount>
        )}
      </FormGroup>

      <SubmitButton type="submit" disabled={!planName.trim() || selected.length === 0}>
        {submitted ? 'Plan Created' : 'Create Training Plan'}
      </SubmitButton>
    </FormStack>
  )
}

function CreateAssignmentForm() {
  const [name, setName] = useState('')
  const [steps, setSteps] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !steps) return
    setSubmitted(true)
    setTimeout(() => {
      setName('')
      setSteps('')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="assignment-name">Assignment Name</Label>
        <Input
          id="assignment-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Advanced Regression Exercise"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="assignment-steps">Number of Steps</Label>
        <Input
          id="assignment-steps"
          type="number"
          min="1"
          max="50"
          value={steps}
          onChange={(event) => setSteps(event.target.value)}
          placeholder="e.g. 5"
        />
      </FormGroup>

      <SubmitButton type="submit" disabled={!name.trim() || !steps}>
        {submitted ? 'Assignment Created' : 'Create Assignment'}
      </SubmitButton>
    </FormStack>
  )
}

function EnrollForm() {
  const [selectedPlan, setSelectedPlan] = useState('')
  const { selected: selectedTrainees, toggle, reset } = useToggleSet()
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedPlan || selectedTrainees.length === 0) return
    setSubmitted(true)
    setTimeout(() => {
      setSelectedPlan('')
      reset()
      setSubmitted(false)
    }, 2000)
  }

  return (
    <FormStack onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="enroll-plan">Training Plan</Label>
        <Select id="enroll-plan" value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)}>
          <option value="">Select a training plan…</option>
          {TRAINING_PLANS.map((plan) => (
            <option key={plan.plan_id} value={plan.plan_id}>
              {plan.plan_name}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label as="span">Trainees</Label>
        <ChecklistWrap>
          {TRAINEES.map((trainee) => (
            <ChecklistItem key={trainee.user_id} $checked={selectedTrainees.includes(trainee.user_id)}>
              <input
                type="checkbox"
                checked={selectedTrainees.includes(trainee.user_id)}
                onChange={() => toggle(trainee.user_id)}
              />
              <ChecklistItemInfo>
                <ChecklistItemTitle>{trainee.username}</ChecklistItemTitle>
                <ChecklistItemSub>{trainee.email}</ChecklistItemSub>
              </ChecklistItemInfo>
              <ChecklistItemId>{trainee.user_id}</ChecklistItemId>
            </ChecklistItem>
          ))}
        </ChecklistWrap>
        {selectedTrainees.length > 0 && (
          <SelectedCount>
            {selectedTrainees.length} trainee{selectedTrainees.length !== 1 ? 's' : ''} selected
          </SelectedCount>
        )}
      </FormGroup>

      <SubmitButton type="submit" disabled={!selectedPlan || selectedTrainees.length === 0}>
        {submitted ? 'Trainees Enrolled' : 'Enroll Trainees'}
      </SubmitButton>
    </FormStack>
  )
}

function CreatePanel() {
  const [tab, setTab] = useState<CreationTab>('plan')
  const activeTab = TABS.find((t) => t.value === tab)!

  return (
    <CreatePanelWrap>
      <TabSwitch role="group" aria-label="Choose what to create">
        {TABS.map((t) => (
          <TabButton
            key={t.value}
            type="button"
            $active={tab === t.value}
            aria-pressed={tab === t.value}
            onClick={() => setTab(t.value)}
          >
            {t.label}
          </TabButton>
        ))}
      </TabSwitch>

      <TabDescription>{activeTab.description}</TabDescription>

      {tab === 'plan' && <CreatePlanForm />}
      {tab === 'assignment' && <CreateAssignmentForm />}
      {tab === 'enroll' && <EnrollForm />}
    </CreatePanelWrap>
  )
}

export default CreatePanel
