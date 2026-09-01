import { useAuth } from '../auth/useAuth'
import TraineeCoursesView from './TraineeCoursesView'
import ManagerDashboard from './manager/ManagerDashboard'

function AssignmentPage() {
  const { user } = useAuth()

  if (user?.role === 'TrainingManager') {
    return <ManagerDashboard />
  }

  return <TraineeCoursesView />
}

export default AssignmentPage
