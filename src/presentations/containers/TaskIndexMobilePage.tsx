import { fetchLabel } from 'action-creators/label';
import { pollRequest } from 'action-creators/request';
import { destroyTask, fetchTask, pollTask, sortTask, updateTask } from 'action-creators/task';
import IconLink from 'presentations/components/IconLink';
import Indicator from 'presentations/components/Indicator';
import LoadingContent from 'presentations/components/LoadingContent';
import NoLabelContent from 'presentations/components/NoLabelContent';
import NoTaskContent from 'presentations/components/NoTaskContent';
import RecycleTable from 'presentations/components/RecycleTable';
import RecycleTableContentList from 'presentations/components/RecycleTableContentList';
import RecycleTableContentListItem from 'presentations/components/RecycleTableContentListItem';
import RecycleTableList from 'presentations/components/RecycleTableList';
import RecycleTableListItem from 'presentations/components/RecycleTableListItem';
import TabNavigation from 'presentations/components/TabNavigation';
import TabNavigationContent from 'presentations/components/TabNavigationContent';
import TaskList from 'presentations/components/TaskList';
import TaskListItem from 'presentations/components/TaskListItem';
import Container from 'presentations/containers/Container';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { poller } from 'utils/poller';

interface ITaskIndexMobilePageState {
  index: number;
}

export default class TaskIndexMobilePage extends Container<IContainerProps, ITaskIndexMobilePageState & IState> {
  public static contextTypes: { move: any } = {
    move: PropTypes.func,
  };

  private handleChangeIndex: (index: number) => void;

  private handleSortTaskList: (from: number, to: number, taskListProps: any) => void;

  private handleClickCompleteButton: (event: React.MouseEvent<HTMLElement>, taskListItemProps: any) => void;

  private handleClickTaskListItem: (event: React.MouseEvent<HTMLElement>, taskListItemProps: any) => void;

  private handleClickDestroyButton: (event: React.MouseEvent<HTMLElement>, taskListItemProps: any) => void;

  constructor(props: IContainerProps) {
    super(props);

    const initialState: ITaskIndexMobilePageState = {
      index: this.loadIndex(),
    };

    this.state = { ...this.getState(), ...initialState };

    this.actions = {
      pollTask: (): Promise<IAction> => {
        return pollTask(this.dispatch);
      },
      pollRequest: (): Promise<IAction> => {
        return pollRequest(this.dispatch, { status: 'pending' });
      },
      fetchLabel: (): Promise<IAction> => {
        return fetchLabel(this.dispatch);
      },
      fetchTask: (): Promise<IAction> => {
        return fetchTask(this.dispatch);
      },
      updateTask: (params: {
        id: number;
        labelId?: number;
        content?: string;
        completed?: boolean;
      }): Promise<IAction> => {
        return updateTask(this.dispatch, params);
      },
      destroyTask: (params: { id: number }): Promise<IAction> => {
        return destroyTask(this.dispatch, params);
      },
      sortTask: (
        params: {
          id: number;
          labelId: number;
          priority: number;
        },
        to: number,
      ): Promise<IAction> => {
        return sortTask(this.dispatch, params, to);
      },
    };

    this.handleChangeIndex = this._handleChangeIndex.bind(this);
    this.handleSortTaskList = this._handleSortTaskList.bind(this);
    this.handleClickCompleteButton = this._handleClickCompleteButton.bind(this);
    this.handleClickTaskListItem = this._handleClickTaskListItem.bind(this);
    this.handleClickDestroyButton = this._handleClickDestroyButton.bind(this);
  }

  public componentDidMount() {
    this.actions.fetchTask();
    this.actions.fetchLabel().then((action: IAction) => {
      const labels = action.payload.labels;
      for (const label of labels) {
        if (label.members.length > 1) {
          poller.add(this.actions.pollTask, 3000);
          break;
        }
      }
    });
    this.actions.pollRequest();
    poller.add(this.actions.pollRequest, 3000);
  }

  public componentWillUnmount() {
    poller.remove(this.actions.pollTask);
    poller.remove(this.actions.pollRequest);

    super.componentWillUnmount();
  }

  public render() {
    const ui: IUI = this.state.ui;
    const labels: ILabel[] = this.state.labels.filter((label: ILabel) => label.visibled);
    const tasks: ITask[] = this.state.tasks;
    const requests: IRequest[] = this.state.requests;

    let contentElement: React.ReactNode | null = null;

    // Loading label - Show loading content
    //   No labels - Show no labels content
    //   Labels - Show recycle table view
    //     Loading tasks - Show skeleton
    //       No tasks - Show no tasks content
    //       Tasks - Show task list
    if (ui.isLoadingLabels && labels.length === 0) {
      contentElement = <LoadingContent />;
    } else if (!ui.isLoadingLabels && labels.length === 0) {
      contentElement = <NoLabelContent />;
    } else if (labels.length !== 0) {
      const recycleTableContents: React.ReactNode = labels.map((label: ILabel, index: number) => {
        const groupedTasks: ITask[] = tasks.filter((task: ITask) => task.labelId === label.id);

        let backgroundElement: React.ReactNode | null = null;
        if (ui.isLoadingTasks && groupedTasks.length === 0) {
          backgroundElement = <LoadingContent />;
        } else if (groupedTasks.length === 0) {
          backgroundElement = <NoTaskContent label={label} />;
        }
        const parentElement: Element = window.document.querySelectorAll('.recycle-table-content-list-item')[index];

        return (
          <RecycleTableContentListItem key={label.id} index={index}>
            <TaskList
              className="task-list"
              parentElement={parentElement}
              tasks={groupedTasks}
              onSort={this.handleSortTaskList}
            >
              {groupedTasks.map((task: ITask): React.ReactNode => {
                return (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onClickCompleteButton={this.handleClickCompleteButton}
                    onClickTaskListItem={this.handleClickTaskListItem}
                    onClickDestroyButton={this.handleClickDestroyButton}
                  />
                );
              })}
            </TaskList>
            {groupedTasks.length === 0 ? null : (
              <IconLink to={`/tasks/new?label-id=${label.id}`} iconType="add" className="task-list--add-button">
                {'ADD TASK'}
              </IconLink>
            )}
            {backgroundElement}
          </RecycleTableContentListItem>
        );
      });

      contentElement = (
        <RecycleTable index={this.state.index} onChange={this.handleChangeIndex}>
          <RecycleTableList>
            {labels.map((label: ILabel, index: number): React.ReactNode => {
              return (
                <RecycleTableListItem key={label.id} index={index}>
                  {label.name}
                </RecycleTableListItem>
              );
            })}
          </RecycleTableList>
          <RecycleTableContentList>{recycleTableContents}</RecycleTableContentList>
        </RecycleTable>
      );
    }

    const badges: number[] = requests.length ? [2] : [];

    return (
      <section className="page task-index-mobile-page">
        <Indicator active={(ui.isLoadingLabels && labels.length !== 0) || (ui.isLoadingTasks && tasks.length !== 0)} />
        <TabNavigationContent>{contentElement}</TabNavigationContent>
        <TabNavigation index={0} badges={badges} />
      </section>
    );
  }

  private loadIndex(): number {
    if (typeof window === 'object') {
      return JSON.parse(window.sessionStorage.getItem('__recycle-table-index') || '0');
    }
    return 0;
  }

  private saveIndex(index: number): void {
    if (typeof window === 'object') {
      window.sessionStorage.setItem('__recycle-table-index', JSON.stringify(index));
    }
  }

  private _handleChangeIndex(index: number): void {
    this.saveIndex(index);
    this.setState({ index });
  }

  private _handleSortTaskList(from: number, to: number, taskListProps: any): void {
    const task: ITask = taskListProps.tasks[from];

    if (task.priority !== to) {
      this.actions.sortTask(
        {
          id: task.id,
          labelId: task.labelId,
          priority: task.priority,
        },
        to,
      );
    }
  }

  private _handleClickCompleteButton(event: React.MouseEvent<HTMLElement>, taskListItemProps: any): void {
    event.stopPropagation();

    this.actions.updateTask({
      id: taskListItemProps.task.id,
      completed: !taskListItemProps.task.completed,
    });
  }

  private _handleClickTaskListItem(event: React.MouseEvent<HTMLElement>, taskListItemProps: any): void {
    this.context.move(`/tasks/${taskListItemProps.task.id}/edit?label-id=${taskListItemProps.task.labelId}`);
  }

  private _handleClickDestroyButton(event: React.MouseEvent<HTMLElement>, taskListItemProps: any): void {
    event.stopPropagation();
    this.actions.destroyTask({
      id: taskListItemProps.task.id,
    });
  }
}
