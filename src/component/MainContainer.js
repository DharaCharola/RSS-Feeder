import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import FeedLauncher from './FeedLauncher'

export default class MainContainer extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={FeedLauncher} />
        </Switch>
      </BrowserRouter>
    )
  }
}
