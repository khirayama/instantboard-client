/* tslint:disable:cyclomatic-complexity */
/* tslint:disable:max-func-body-length */
import { actionTypes } from 'constants/actionTypes';

export function reducers(state: IState, action: IAction): IState {
  const newState: IState = JSON.parse(JSON.stringify(state));
  const payload: {
    task: ITask;
    tasks: ITask[];
    label: ILabel;
    labels: ILabel[];
    request: IRequest;
    requests: IRequest[];
    members: IMember[];
    profile: IUser;
    priority: number;
  } =
    action.payload;

  switch (action.actionType) {
    // LABEL
    case actionTypes.FETCH_LABEL: {
      newState.ui.isLoadingLabels = true;
      break;
    }
    case actionTypes.FETCH_LABEL_SUCCESS: {
      newState.labels = payload.labels;
      newState.ui.isLoadingLabels = false;
      break;
    }
    case actionTypes.FETCH_LABEL_FAILURE: {
      newState.ui.isLoadingLabels = false;
      break;
    }

    case actionTypes.CREATE_LABEL: {
      newState.ui.isLoadingLabels = true;
      break;
    }
    case actionTypes.CREATE_LABEL_SUCCESS: {
      newState.labels.push(payload.label);
      newState.ui.isLoadingLabels = false;
      break;
    }
    case actionTypes.CREATE_LABEL_FAILURE: {
      newState.ui.isLoadingLabels = false;
      break;
    }

    case actionTypes.UPDATE_LABEL: {
      newState.ui.isLoadingLabels = true;
      break;
    }
    case actionTypes.UPDATE_LABEL_SUCCESS: {
      newState.labels = newState.labels.map((label: ILabel) => {
        if (label.id === payload.label.id) {
          return payload.label;
        }

        return label;
      });
      newState.ui.isLoadingLabels = false;
      break;
    }
    case actionTypes.UPDATE_LABEL_FAILURE: {
      newState.ui.isLoadingLabels = false;
      break;
    }

    case actionTypes.DESTROY_LABEL: {
      newState.labels = newState.labels.filter((label: ILabel) => {
        return label.id !== payload.label.id;
      });
      newState.ui.isLoadingLabels = true;
      break;
    }
    case actionTypes.DESTROY_LABEL_SUCCESS: {
      newState.ui.isLoadingLabels = false;
      break;
    }
    case actionTypes.DESTROY_LABEL_FAILURE: {
      newState.ui.isLoadingLabels = false;
      break;
    }

    case actionTypes.SORT_LABEL: {
      // Uncomfortable to immediate update UI.
      newState.labels = ((): ILabel[] => {
        let labels: ILabel[] = state.labels;
        const newLabel: ILabel = payload.label;
        const priority: number = payload.priority;

        if (newLabel.priority > priority) {
          labels = labels.map((label: ILabel) => {
            if (label.priority === newLabel.priority) {
              label.priority = priority;
            } else if (priority <= label.priority && label.priority < newLabel.priority) {
              label.priority += 1;
            }

            return label;
          });
        } else if (newLabel.priority < priority) {
          labels = labels.map((label: ILabel) => {
            if (label.priority === newLabel.priority) {
              label.priority = priority;
            } else if (newLabel.priority < label.priority && label.priority <= priority) {
              label.priority -= 1;
            }

            return label;
          });
        }

        return labels.sort((x: ILabel, y: ILabel) => {
          if (x.priority > y.priority) {
            return 1;
          }
          if (x.priority < y.priority) {
            return -1;
          }

          return 0;
        });
      })();
      newState.ui.isLoadingLabels = true;
      break;
    }
    case actionTypes.SORT_LABEL_SUCCESS: {
      newState.labels = payload.labels;
      newState.ui.isLoadingLabels = false;
      break;
    }
    case actionTypes.SORT_LABEL_FAILURE: {
      newState.ui.isLoadingLabels = false;
      break;
    }

    // TASK
    case actionTypes.FETCH_TASK: {
      newState.ui.isLoadingTasks = true;
      break;
    }
    case actionTypes.FETCH_TASK_SUCCESS: {
      newState.tasks = payload.tasks;
      newState.ui.isLoadingTasks = false;
      break;
    }
    case actionTypes.FETCH_TASK_FAILURE: {
      newState.ui.isLoadingTasks = false;
      break;
    }

    case actionTypes.CREATE_TASK: {
      newState.ui.isLoadingTasks = true;
      break;
    }
    case actionTypes.CREATE_TASK_SUCCESS: {
      newState.tasks.push(payload.task);
      newState.ui.isLoadingTasks = false;
      break;
    }
    case actionTypes.CREATE_TASK_FAILURE: {
      newState.ui.isLoadingTasks = false;
      break;
    }

    case actionTypes.UPDATE_TASK: {
      newState.ui.isLoadingTasks = true;
      break;
    }
    case actionTypes.UPDATE_TASK_SUCCESS: {
      newState.tasks = newState.tasks.map((task: ITask) => {
        if (task.id === payload.task.id) {
          return payload.task;
        }

        return task;
      });
      newState.ui.isLoadingTasks = false;
      break;
    }
    case actionTypes.UPDATE_TASK_FAILURE: {
      newState.ui.isLoadingTasks = false;
      break;
    }

    case actionTypes.DESTROY_TASK: {
      newState.tasks = newState.tasks.filter((task: ITask) => {
        return task.id !== payload.task.id;
      });
      newState.ui.isLoadingTasks = true;
      break;
    }
    case actionTypes.DESTROY_TASK_SUCCESS: {
      newState.ui.isLoadingTasks = false;
      break;
    }
    case actionTypes.DESTROY_TASK_FAILURE: {
      newState.ui.isLoadingTasks = false;
      break;
    }

    case actionTypes.SORT_TASK: {
      // Uncomfortable to immediate update UI.
      newState.tasks = ((): ITask[] => {
        let tasks: ITask[] = state.tasks;
        const newTask: ITask = payload.task;
        const priority: number = payload.priority;

        if (newTask.priority > priority) {
          tasks = tasks.map((task: ITask) => {
            if (task.labelId === newTask.labelId) {
              if (task.priority === newTask.priority) {
                task.priority = priority;
              } else if (priority <= task.priority && task.priority < newTask.priority) {
                task.priority += 1;
              }
            }

            return task;
          });
        } else if (newTask.priority < priority) {
          tasks = tasks.map((task: ITask) => {
            if (task.labelId === newTask.labelId) {
              if (task.priority === newTask.priority) {
                task.priority = priority;
              } else if (newTask.priority < task.priority && task.priority <= priority) {
                task.priority -= 1;
              }
            }

            return task;
          });
        }

        return tasks.sort((x: ITask, y: ITask) => {
          if (x.priority > y.priority) {
            return 1;
          }
          if (x.priority < y.priority) {
            return -1;
          }

          return 0;
        });
      })();
      newState.ui.isLoadingTasks = true;
      break;
    }
    case actionTypes.SORT_TASK_SUCCESS: {
      newState.tasks = payload.tasks;
      newState.ui.isLoadingTasks = false;
      break;
    }
    case actionTypes.SORT_TASK_FAILURE: {
      newState.ui.isLoadingTasks = false;
      break;
    }

    case actionTypes.POLL_TASK_SUCCESS: {
      newState.tasks = state.ui.isLoadingTasks ? newState.tasks : payload.tasks;
      break;
    }
    case actionTypes.POLL_TASK_FAILURE: {
      break;
    }

    // USER
    case actionTypes.GET_USER: {
      break;
    }
    case actionTypes.GET_USER_SUCCES: {
      newState.profile = payload.profile;
      break;
    }
    case actionTypes.GET_USER_FAILURE: {
      break;
    }

    case actionTypes.FETCH_MEMBER: {
      break;
    }
    case actionTypes.FETCH_MEMBER_SUCCESS: {
      newState.members = payload.members;
      break;
    }
    case actionTypes.FETCH_MEMBER_FAILURE: {
      break;
    }

    // REQUEST
    case actionTypes.FETCH_REQUEST: {
      newState.ui.isLoadingRequests = true;
      break;
    }
    case actionTypes.FETCH_REQUEST_SUCCESS: {
      newState.requests = payload.requests;
      newState.ui.isLoadingRequests = false;
      break;
    }
    case actionTypes.FETCH_REQUEST_FAILURE: {
      newState.ui.isLoadingRequests = false;
      break;
    }

    case actionTypes.UPDATE_REQUEST: {
      newState.ui.isLoadingRequests = true;
      break;
    }
    case actionTypes.UPDATE_REQUEST_SUCCESS: {
      newState.requests = state.requests.filter((request: IRequest) => {
        return payload.request.id !== request.id;
      });
      newState.ui.isLoadingRequests = false;
      break;
    }
    case actionTypes.UPDATE_REQUEST_FAILURE: {
      newState.ui.isLoadingRequests = false;
      break;
    }

    case actionTypes.POLL_REQUEST_SUCCESS: {
      newState.requests = state.ui.isLoadingRequests ? newState.requests : payload.requests;
      break;
    }

    case actionTypes.POLL_REQUEST_FAILURE: {
      break;
    }

    default: {
      return newState;
    }
  }

  return newState;
}
