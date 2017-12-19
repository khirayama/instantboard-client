import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  fetchLabel,
} from '../../../action-creators/label';
import {
  createTask,
  fetchTask,
  updateTask,
} from '../../../action-creators/task';
import Link from '../../../router/link';
import queryString from '../../../utils/query-string';
import Icon from '../../components/icon';
import Indicator from '../../components/indicator';
import Container from '../container';

export default class TaskMobilePage extends Container<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  private handleChangeLabelIdSelect: any;

  private handleChangeContentInput: any;

  private handleKeyDownContentInput: any;

  private handleSubmit: any;

  constructor(props: any) {
    super(props);

    const {params} = props;
    const initialState = {
      taskId: (params.id) ? Number(params.id) : null,
      content: '',
      labelId: null,
      uiBlocking: false,
    };

    this.state = Object.assign({}, this.state, initialState);

    this.actions = {
      fetchLabel: () => {
        return fetchLabel(this.dispatch);
      },
      fetchTask: () => {
        return fetchTask(this.dispatch);
      },
      createTask: (task: ITaskRequest) => {
        return createTask(this.dispatch, task);
      },
      updateTask: (task: ITaskRequest) => {
        return updateTask(this.dispatch, task);
      },
    };

    this.handleChangeLabelIdSelect = this._handleChangeLabelIdSelect.bind(this);
    this.handleChangeContentInput = this._handleChangeContentInput.bind(this);
    this.handleKeyDownContentInput = this._handleKeyDownContentInput.bind(this);
    this.handleSubmit = this._handleSubmit.bind(this);
  }

  public componentDidMount() {
    this.actions.fetchLabel();
    this.actions.fetchTask();
  }

  public componentDidUpdate(prevProps, prevState) {
    this.onUpdate(() => {
      const ui = this.state.ui;
      const prevUi = prevState.ui;
      const tasks = this.state.tasks;
      const labels = this.state.labels;

      let selectedLabelId: number|null = null;
      if (typeof window === 'object') {
        const query = queryString.parse(window.location.search);
        if (query['label-id']) {
          selectedLabelId = Number(query['label-id']);
        }
      }

      if (prevUi.isLoadingLabels && !ui.isLoadingLabels && labels.length !== 0) {
        let labelId = labels[0].id;
        for (const label of labels) {
          if (label.id === selectedLabelId) {
            labelId = label.id;
            break;
          }
        }
        this.setState({labelId});
      }

      if (prevUi.isLoadingTasks && !ui.isLoadingTasks && tasks.length !== 0 && this.state.taskId) {
        for (const task of tasks) {
          if (task.id === this.state.taskId) {
            this.setState({content: task.content});
            break;
          }
        }
      }
    });
  }

  public render() {
    const ui = this.state.ui;
    const labels = this.state.labels;

    return (
      <section className="page task-mobile-page">
        {(this.state.uiBlocking) ? <div className="ui-block"/> : null}
        <Indicator active={(ui.isLoadingTasks)}/>
        <form onSubmit={this.handleSubmit}>
          <header className="task-mobile-page--header">
            <Link to="/">
              <Icon type="back"/>
            </Link>
            <button type="submit">
              <Icon type="send"/>
            </button>
          </header>
          <div className="task-mobile-page--label-block">
            <Link to="/labels">
              <Icon type="label"/>
            </Link>
            {(this.state.labelId) ? (
              <select value={this.state.labelId} onChange={this.handleChangeLabelIdSelect}>
                {labels.map((label: any) => (
                  <option key={label.id} value={label.id}>
                    {label.name}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
          <div>
            <input
              type="text"
              className="task-mobile-page--task-content-input"
              autoFocus
              value={this.state.content}
              onChange={this.handleChangeContentInput}
              onKeyDown={this.handleKeyDownContentInput}
              placeholder="Enter task text"
            />
          </div>
        </form>
      </section>
    );
  }

  private onUpdate(callback) {
    callback();
  }

  private _handleChangeLabelIdSelect(event: any) {
    this.setState({labelId: event.currentTarget.value});
  }

  private _handleChangeContentInput(event: any) {
    this.setState({content: event.currentTarget.value});
  }

  private _handleKeyDownContentInput(event: any) {
    const ENTER_KEY_CODE = 13;

    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      this.submitTask();
    }
  }

  private _handleSubmit(event: any) {
    event.preventDefault();
    this.submitTask();
  }

  private submitTask() {
    const content = this.state.content.trim();
    const id = this.props.params.id;

    if (content && !this.state.uiBlocking) {
      this.setState({uiBlocking: true});

      if (id === undefined || id === null) {
        this.actions.createTask({
          content,
          labelId: this.state.labelId,
        }).then(() => {
          this.context.move('/');
        });
      } else {
        this.actions.updateTask({
          id,
          content,
          labelId: this.state.labelId,
        }).then(() => {
          this.context.move('/');
        });
      }
    }
  }
}