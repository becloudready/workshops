export type Assignment = {
  assignment_id: string
  assignment_name: string
  numberOfSteps: number
  completed: boolean
}

export type TrainingPlan = {
  plan_id: string
  plan_name: string
  assignments: Assignment[]
  completed: boolean
}

export function planProgress(plan: TrainingPlan): number {
  if (plan.assignments.length === 0) return 0
  const completedCount = plan.assignments.filter((a) => a.completed).length
  return Math.round((completedCount / plan.assignments.length) * 100)
}
