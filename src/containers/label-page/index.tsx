import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  fetchLabel,
  createLabel,
} from '../../action-creators';
import Container from '../container';

export default class LabelPage extends Container<any, any> {
  public static contextTypes = {
    move: PropTypes.func,
  };

  private handleChangeNameInput: any;

  private handleSubmit: any;

  constructor(props: any) {
    super(props);

    this.state = Object.assign({}, this.state, {name: ''});

    this.actions = {
      fetchLabel: () => {
        fetchLabel(this.dispatch);
      },
      createLabel: (label) => {
        createLabel(this.dispatch, label).then(() => {
          this.context.move('/labels');
        });
      },
    };

    this.handleChangeNameInput = this._handleChangeNameInput.bind(this);
    this.handleSubmit = this._handleSubmit.bind(this);
  }

  public componentDidMount() {
    this.actions.fetchLabel();
  }

  public componentDidUpdate(prevProps, prevState) {
    const ui = this.state.ui;
    const prevUi = prevState.ui;
    const labels = this.state.labels;
    const selectedLabelId = this.props.params.id;

    if (prevUi.isLoadingLabels && !ui.isLoadingLabels && labels.length !== 0 && selectedLabelId) {
      let name = '';
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        if (label.id === selectedLabelId) {
          this.setState({name: label.name});
          break;
        }
      }
    }
  }

  public render() {
    return (
      <section className="page label-page">
        <form onSubmit={this.handleSubmit}>
          <input type="text" autoFocus value={this.state.name} onChange={this.handleChangeNameInput} />
          <button>Create!</button>
        </form>
      </section>
    );
  }

  private _handleChangeNameInput(event: any) {
    this.setState({name: event.currentTarget.value});
  }

  private _handleSubmit(event: any) {
    event.preventDefault();
    const name = this.state.name.trim();
    if (name) {
      this.actions.createLabel({name});
    }
  }
}
