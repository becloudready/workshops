from app.models.task_assignment import TaskAssignment
from app.models.user import User


class TaskAssignmentFactory:
    """Builds the per-trainee task_assignments fan-out for a newly created task."""

    @staticmethod
    def build_for_cohort(task_id: int, trainees: list[User]) -> list[TaskAssignment]:
        return [TaskAssignment(task_id=task_id, trainee_id=trainee.id) for trainee in trainees]

    @staticmethod
    def build_for_trainee_ids(task_id: int, trainee_ids: list[int]) -> list[TaskAssignment]:
        return [TaskAssignment(task_id=task_id, trainee_id=trainee_id) for trainee_id in trainee_ids]
