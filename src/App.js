import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import {AsyncComponent} from 'Utils/asyncComponent.jsx'
import SwitchCSSTransitionGroup from 'switch-css-transition-group'

class App extends Component {
    
  render() {
    return (
        <SwitchCSSTransitionGroup
            location={this.props.location}
            transitionName='example'
            transitionLeaveTimeout={300}
            transitionEnterTimeout={500}>
                  <Route exact strict path="/isLogin" component={AsyncComponent('isLogin')} />
                  <Route exact strict path="/home" component={AsyncComponent('Home')} />
                  <Route exact strict path="/login" component={AsyncComponent('Login')} />
                  <Route exact strict path="/" component={AsyncComponent('Sign')} />
        </SwitchCSSTransitionGroup>
    );
  }
}
export default App;
