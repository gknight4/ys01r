import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import Alert from 'react-bootstrap/lib/Alert'
import { BrowserRouter as Router, Route } from "react-router-dom"; // , Link
//import BasicExample from './BasicExample.js'
import YSHeader from './components/YSHeader/YSHeader.js'
import ParentHome from './components/ParentHome/ParentHome.js'
import ChildDetail from './components/ChildDetail/ChildDetail.js'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <YSHeader />
          <Route path="/parentHome" component={ParentHome} />
          <Route path="/child/:childName" component={ChildDetail} />

        </div>
      </Router>
    );
  }
}

export default App;

/*
the Your-Stash client:

parent needs to:
add / remove children, add/remove transactions
create / delete parent account
view all childrens balances
view one childs transactions
edit a transaction


create a parent account:
click on Create Account/parent in the header (where login would bd)
a box pups up to enter email / password, with Create button

message says, check your email to confirm the account

 to add a child:
 click on add a childs
 box asks for childs name

 child initial login:
 click on Create Account: asks if parent or childs


Child:
view recent transactions and balances

header:
from here, we can login, create a new parent account,

when we're logged in, as a parent,
we can see the child balances
logout
click on a child to see their r4ecent transactions
select new from the header, to add a child

from the parent home page, to add a transaction:
click on child
select amount
select name
click add

components:
url director
header
child balance: shows the balance for a child - click on child to edit, then add a child button
child summary: shows the last 5 transactions, and the balance - click on a transaction to edit / delete it
create account: accept email, password
add child: accept child's className
edit child, change name, or delete
edit transaction: change name, amount, or delete




*/
