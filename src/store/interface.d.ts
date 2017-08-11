// Store
type IDispatch = (action: IAction) => void;

interface IStore {
  getState: () => IState;
  dispatch: IDispatch;
  addChangeListener: (listener: any) => void;
  removeChangeListener: (listener: any) => void;
}

// State
// Resource
interface IUser {
  id: string;
}

interface IRequest {
  id: string;
}

interface ILabel {
  id: string;
}

interface ITask {
  id: string;
}

// UI
interface IUI {
  selectedLabelId: string|null;
  selectedTaskId: string|null;
  isLoadingTasks: boolean;
  isLoadingLabels: boolean;
  isLoadingRequests: boolean;
  isLoadingMembers: boolean;
  isShownTaskModal: boolean;
  isShownLabelModal: boolean;
  errors: Array<{
    resourceName: string;
    resourceId: string|null;
    message: string|null;
  }>;
}

// State
interface IState {
  idToken: string|null;
  profile: IUser|null;
  tasks: ITask[];
  labels: ILabel[];
  requests: IRequest[];
  members: IUser[];
  ui: IUI;
}