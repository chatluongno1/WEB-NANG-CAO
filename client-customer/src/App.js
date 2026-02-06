import axios from 'axios';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Hello from server!'
    };
  }

  componentDidMount() {
    axios.get('/hello').then((res) => {
      const result = res.data;
      this.setState({ message: result.message });
    });
  }

  render() {
    return (
      <div>
        <h2>Customer page</h2>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
