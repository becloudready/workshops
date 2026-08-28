import type { TrainingPlan } from './trainingPlan'

export type Trainee = {
  user_id: string
  username: string
  email: string
  role: 'Trainee'
  training_progress: TrainingPlan[]
}
