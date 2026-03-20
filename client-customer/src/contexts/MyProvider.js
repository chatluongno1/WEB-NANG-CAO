import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);

    // initialize from localStorage if present
    const storedToken = localStorage.getItem('token') || '';
    const storedCustomer = localStorage.getItem('customer');
    let parsedCustomer = null;
    try {
      parsedCustomer = storedCustomer ? JSON.parse(storedCustomer) : null;
    } catch (e) {
      parsedCustomer = null;
    }

    this.state = {
      token: storedToken,
      customer: parsedCustomer,
      mycart: [],

      setToken: this.setToken,
      setCustomer: this.setCustomer,
      setMycart: this.setMycart,
      logout: this.logout
    };
  }

  setToken = (value) => {
    localStorage.setItem('token', value);
    this.setState({ token: value });
  }

  setCustomer = (value) => {
    if (value) {
      localStorage.setItem('customer', JSON.stringify(value));
    } else {
      localStorage.removeItem('customer');
    }
    this.setState({ customer: value });
  }

  setMycart = (value) => {
    this.setState({ mycart: value });
  }

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('customer');
    this.setState({ token: '', customer: null, mycart: [] });
  }

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;