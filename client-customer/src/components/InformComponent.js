import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext;

  handleLogout = () => {
    this.context.logout();
  };

  render() {
    const count = this.context.mycart ? this.context.mycart.length : 0;
    const loggedIn = this.context.token && this.context.token !== '';

    return (
      <div className="border-bottom">
        <div className="float-left">
          {loggedIn ? (
            <>
              Hello <b>{this.context.customer?.name || this.context.customer?.username}</b> | <Link to='/home' onClick={this.handleLogout}>Logout</Link> |
              <Link to='/myprofile'>My profile</Link> | <Link to='/myorders'>My orders</Link>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link> | <Link to='/signup'>Sign-up</Link> | <Link to='/active'>Active</Link>
            </>
          )}
        </div>
        <div className="float-right">
          <Link to='/mycart'>My cart</Link> have <b>{count}</b> items
        </div>
        <div className="float-clear" />
      </div>
    );
  }
}
export default Inform;