
import heapq


def schedule_tasks(tasks):
    """
    Arrange incomplete tasks by earliest deadline
    using a Min-Heap.
    """

    task_heap = []

    for task in tasks:
        if not task.done:
            heapq.heappush(
                task_heap,
                (task.deadline.timestamp(), task.id, task)
            )

    scheduled_tasks = []

    while task_heap:
        _, _, task = heapq.heappop(task_heap)
        scheduled_tasks.append(task)

    return scheduled_tasks


def reschedule_on_completion(tasks, completed_task_id):
    """
    Rebuild the task schedule after a task is completed.
    Completed tasks are excluded from the queue.
    """

    remaining_tasks = [
        task for task in tasks
        if not task.done and task.id != completed_task_id
    ]

    return schedule_tasks(remaining_tasks)
