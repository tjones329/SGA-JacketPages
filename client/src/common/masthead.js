import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from '../redux/auth/actions';

class Masthead extends Component {
  constructor(props) {
    super(props);

    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    this.props.login();
  }

  render() {
    return (
      <div id="masthead" styles={{ flex: 1 }}>
        <div id="identity" className="clearfix">
          <div id="identity-wrapper">
            <h1 id="gt-logo">
              <a href="http://gatech.edu/" rel="" title="Georgia Tech">
                <img src="./img/logo-gt.png" alt="Georgia Tech" />
              </a>
            </h1>
            <h2 id="jp-logo">
              <a href="http://jacketpages.gatech.edu/" rel="" title="JacketPages">
                <img src="./img/jacketpages.png" alt="Jacket Pages" />
              </a>
            </h2>
          </div>
        </div>
        <div id="primary-menus">
          <div id="primary-menus-wrapper" className="clearfix">
            <a id="primary-menus-toggle" className="hide-for-desktop"><span>Menu</span></a>
            <div id="primary-menus-off-canvas" className="off-canvas">
              <a id="primary-menus-close" className="hide-for-desktop"><span>Close</span></a>
              <div id="utility">
                <div className="row clearfix">
                  <div id="utility-links">
                    <ul className="menu">
                      <li className="mothership ulink"><a href="http://www.gatech.edu/">Georgia Tech Home</a></li>
                      <li className="campus-map ulink"><a href="http://www.map.gatech.edu/">Map</a></li>
                      <li className="directories ulink"><a href="http://www.gatech.edu/directory">Directory</a></li>
                      <li className="offices ulink"><a href="http://www.gatech.edu/departments">Offices</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="nav">
                <div id="main-menu-wrapper">
                  <ul className="menu">
                    <li className="expanded first" />
                    <li className="expanded" />
                    <AccountTab
                      user={this.props.user}
                      adminInfo={this.props.adminInfo}
                      repInfo={this.props.repInfo}
                      userInfo={this.props.userInfo}
                    />
                    <li className="expanded" />
                    <li className="expanded">
                      <a href="/organizations"><span>Organizations</span></a>
                    </li>
                    <li className="expanded" />
                    <li className="expanded">
                      <a href="/sgapeople"><span>Student Government</span></a>
                      <ul className="menu">
                        <li className="leaf first">
                          <a href="/sgapeople">View SGA Members</a>
                        </li>
                        {this.props.user
                          && (this.props.user.level === 'sga_user' || this.props.user.level === 'admin')
                          && (
                            <li className="leaf">
                              <a href="/bill_voting">Vote on Bills</a>
                            </li>
                          )}
                        {this.props.user && this.props.user.level === 'admin' && (
                          <li className="leaf">
                            <a href="/administerBudgets">Administer Budgets</a>
                          </li>
                        )}
                        {this.props.user && this.props.user.level === 'admin' && (
                          <li className="leaf">
                            <a href="/budgetSubmissions">Budget Submissions</a>
                          </li>
                        )}
                      </ul>
                    </li>
                    <li className="expanded" />
                    <li className="expanded">
                      <a href="/bills"><span>Bills</span></a>
                      <ul className="menu">
                        <li className="leaf first">
                          <a href="/create_bill">Submit Bill</a>
                        </li>
                        <li className="leaf">
                          <a href="http://jacketpages.gatech.edu/bills/my_bills">View My Bills</a>
                        </li>
                        <li className="leaf last">
                          <a href="/bills">View All Bills</a>
                        </li>
                      </ul>
                    </li>
                    <li className="expanded" />
                    <li className="expanded">
                      <a href="http://localhost:3000/help"><span>Help</span></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Masthead.propTypes = {
  login: PropTypes.func.isRequired,
  user: PropTypes.shape,
};

const AccountTab = (props) => {
  if (props.user) {
    return (
      <li className="expanded">
        <a href="http://jacketpages.gatech.edu/users/view/22053"><span>My Account</span></a>
        <ul className="menu">
          <li className="leaf first">
            <a href="http://jacketpages.gatech.edu/users/view/22053">Account Profile</a>
          </li>
          <li className="leaf">
            <a href="http://jacketpages.gatech.edu/users/logout">Logout</a>
          </li>
          <li className="leaf last">
            <a href="http://jacketpages.gatech.edu/">JacketPages Home</a>
          </li>
        </ul>
      </li>
    );
  }
  return (
    <li className="expanded">
      <a href="https://localhost:80/auth/login"><span>Login</span></a>
      <ul className="menu">
        <li className="leaf first">
          <button onClick={props.adminInfo}>Admin</button>
        </li>
        <li className="leaf">
          <button onClick={props.repInfo}>Rep</button>
        </li>
        <li className="leaf">
          <button onClick={props.userInfo}>User</button>
        </li>
      </ul>
    </li>
  );
};

AccountTab.propTypes = {
  user: PropTypes.shape,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  info: () => dispatch(actions.info()),
  adminInfo: () => dispatch(actions.adminInfo()),
  repInfo: () => dispatch(actions.repInfo()),
  userInfo: () => dispatch(actions.userInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Masthead);
