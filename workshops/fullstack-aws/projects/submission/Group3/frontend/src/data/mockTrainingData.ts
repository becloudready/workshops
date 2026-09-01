import type { TrainingPlan, Assignment } from '../types/trainingPlan'
import type { Trainee } from '../types/trainee'

// Placeholder data shaped like the real model (plan_id/plan_name,
// assignment_id/assignment_name, number_of_steps, complete/incomplete)
// until the /training-plans and /trainees endpoints exist.
export const TRAINING_PLANS: TrainingPlan[] = [
  {
    plan_id: 'P1',
    plan_name: 'Foundations of Data Analysis',
    completed: true,
    assignments: [
      { assignment_id: 'A1', assignment_name: 'Intro to Spreadsheets', numberOfSteps: 3, completed: true },
      { assignment_id: 'A2', assignment_name: 'Data Types Quiz', numberOfSteps: 2, completed: true },
      { assignment_id: 'A3', assignment_name: 'Dataset Cleaning Project', numberOfSteps: 5, completed: true },
    ],
  },
  {
    plan_id: 'P2',
    plan_name: 'Statistical Methods for Practitioners',
    completed: false,
    assignments: [
      { assignment_id: 'A4', assignment_name: 'Descriptive Statistics Reading', numberOfSteps: 2, completed: true },
      { assignment_id: 'A5', assignment_name: 'Probability Fundamentals Quiz', numberOfSteps: 3, completed: true },
      { assignment_id: 'A6', assignment_name: 'Regression Analysis Exercise', numberOfSteps: 4, completed: false },
      { assignment_id: 'A7', assignment_name: 'Final Statistical Report', numberOfSteps: 6, completed: false },
    ],
  },
  {
    plan_id: 'P3',
    plan_name: 'Data Visualization & Storytelling',
    completed: false,
    assignments: [
      { assignment_id: 'A8', assignment_name: 'Chart Types Overview', numberOfSteps: 2, completed: true },
      { assignment_id: 'A9', assignment_name: 'Tableau Basics Exercise', numberOfSteps: 3, completed: false },
      { assignment_id: 'A10', assignment_name: 'Dashboard Design Quiz', numberOfSteps: 2, completed: false },
      { assignment_id: 'A11', assignment_name: 'Capstone Visualization Project', numberOfSteps: 8, completed: false },
    ],
  },
  {
    plan_id: 'P4',
    plan_name: 'Machine Learning Essentials',
    completed: false,
    assignments: [
      { assignment_id: 'A12', assignment_name: 'ML Concepts Reading', numberOfSteps: 3, completed: false },
      { assignment_id: 'A13', assignment_name: 'Python Environment Setup', numberOfSteps: 2, completed: false },
      { assignment_id: 'A14', assignment_name: 'Model Evaluation Quiz', numberOfSteps: 4, completed: false },
    ],
  },
]

// Flat assignment bank (for the "attach assignments to a new plan" form) —
// deduplicated from the plans above by assignment_id.
export const ASSIGNMENTS: Assignment[] = Array.from(
  new Map(
    TRAINING_PLANS.flatMap((plan) => plan.assignments).map((assignment) => [
      assignment.assignment_id,
      assignment,
    ]),
  ).values(),
)

export const TRAINEES: Trainee[] = [
  {
    user_id: 'U1',
    username: 'amara.osei',
    email: 'amara.osei@example.com',
    role: 'Trainee',
    training_progress: [TRAINING_PLANS[0]],
  },
  {
    user_id: 'U2',
    username: 'lena.hartmann',
    email: 'lena.hartmann@example.com',
    role: 'Trainee',
    training_progress: [TRAINING_PLANS[1]],
  },
  {
    user_id: 'U3',
    username: 'marcus.chen',
    email: 'marcus.chen@example.com',
    role: 'Trainee',
    training_progress: [TRAINING_PLANS[1], TRAINING_PLANS[2]],
  },
  {
    user_id: 'U4',
    username: 'priya.nair',
    email: 'priya.nair@example.com',
    role: 'Trainee',
    training_progress: [],
  },
]
