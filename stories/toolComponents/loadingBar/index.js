import React from 'react';
import LoadingBar from 'src/loading-bar';
import 'src/loading-bar/style';
import README from './README.md';

class LoadingBarDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  onLoading = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        setTimeout(() => {
          this.setState({
            loading: false
          });
        }, 3000);
      }
    );
  };
  render() {
    const loading = this.state.loading;
    return (
      <React.Fragment>
        <button onClick={this.onLoading}>点击 Loading 3s</button>
        {loading && <LoadingBar />}
      </React.Fragment>
    );
  }
}

export default function() {
  return <LoadingBarDemo />;
}

export const loadingBarDoc = README;
