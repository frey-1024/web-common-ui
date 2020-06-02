import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
  children: React.ReactElement;
  getContainer?: () => HTMLElement;
  didUpdate?: (value: any) => void;
}

export default class Portal extends React.Component<PortalProps> {
  container: any;
  static getContainer = () => {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.top = '0';
    element.style.left = '0';
    element.style.width = '100%';
    window.document.body.appendChild(element);
    return element;
  };

  componentDidMount() {
    this.createContainer();
  }

  componentDidUpdate(prevProps: PortalProps) {
    const { didUpdate } = this.props;
    if (didUpdate) {
      didUpdate(prevProps);
    }
  }

  componentWillUnmount() {
    this.removeContainer();
  }

  createContainer() {
    this.container = this.props.getContainer ? this.props.getContainer() : Portal.getContainer();
    this.forceUpdate();
  }

  removeContainer() {
    if (this.container) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  render() {
    if (this.container) {
      return ReactDOM.createPortal(this.props.children, this.container);
    }
    return null;
  }
}
