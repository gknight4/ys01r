import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import Alert from 'react-bootstrap/lib/Alert'
import { Router, Route } from "react-router-dom"; // , Link
//import BasicExample from './BasicExample.js'
import YSHeader from './components/YSHeader/YSHeader.js'
import ParentHome from './components/ParentHome/ParentHome.js'
import ChildDetail from './components/ChildDetail/ChildDetail.js'
import EditTransaction from './components/EditTransaction/EditTransaction.js'
//import Login from './components/Login/Login.js'
//import MyFocus from './components/MyFocus/MyFocus.js'
import history from './history.js'
import { po } from './components/utils.js'
//import { pi } from './components/utils.js'

// import DatePicker from 'react-datepicker'
//import Moment from 'react-moment'
// import moment from 'moment'
//import App2 from './DatePicker.js'

class App extends Component {
    showLogin = false ;
    
    constructor(props){
        super(props);
        this.state = {
            width: 0, 
            height: 0,
//            headerData: {loginData: {auth: null, loggedIn: false}},
            loggedIn: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.getHeaderData = this.getHeaderData.bind(this);
        this.setLoggedIn = this.setLoggedIn.bind(this);
        
    }
    
    updateWindowDimensions(){
        this.setState({width: window.innerWidth, height: window.innerHeight});
//        console.log(window.innerWidth);
    }
    
    tryLogIn(){
// if we have credentials in local storage, try them
//        console.log(SHA256(that.state.password).toString()); // 4e5bc14c80a9255305d82958b5d503bf75642a78993618f2b9506b9eb0a2e22d
        console.log("try login");
        var url = "http://yourstash.tr8.us:6026/open/login";
        var loginInfo = {
            "username": localStorage.getItem("username"),
            "password": localStorage.getItem("password")
        }
//
        console.log ("user: " + loginInfo.username + ", pass: " + loginInfo.password);
        fetch(url, po('POST', JSON.stringify(loginInfo)))
        .then(response => response.json().then(resp=>{
            console.log(resp);
            if (resp.success) sessionStorage.setItem("auth", response.headers.get("Authorization")) ;
            this.setState({loggedIn: resp.success});//{headerData: {loginData: {loggedIn: resp.success}}}
//            return resp.success ;
        }))
//        return false ;
    }
    
    checkLoggedIn(){
/*
 this is run when the page first loads. If our auth token is not valid, get a new one, and save it
 
*/
//        sessionStorage.setItem("some", "");
//        sessionStorage.removeItem("some") ;
        var auth = sessionStorage.getItem("auth");
//        console.log("auth: " + typeof auth);
//        console.log(auth + " length: " + auth.length);
//        console.log(Boolean(auth));
//        if ((auth == null) || (auth == "")) console.log("is null");
        if(auth !== null){
//          console.log("not null?");
            var url = "http://yourstash.tr8.us:6026/api/authcheck";
            let postObj = po('GET', "");
            postObj.headers.authorization = auth ;
            return fetch(url, postObj)
            .then(response => {
                if (response.status === 200){
                    response.json().then(resp=>{
                        this.setState({loggedIn: resp.success}); // {headerData: {loginData: {loggedIn: resp.success}}}
//                        console.log("its: " + resp.success);
//                        return resp.success ;
                    })
                } else {
                    this.tryLogIn();
                }
            });
        } else {
            this.tryLogIn();
        }
    }
        
    componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.checkLoggedIn();
//        this.setState({loggedIn: this.checkLoggedIn()}) ;
    }
    
    componenetWillUnmout(){
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    getHeaderData(data){
        this.setState({headerData: data});
//        export const AuthContext = React.createContext(data.loginData);
//        console.log("parent data");
//        console.log(data);
    }
    
    setLoggedIn(loggedIn){
      console.log("set logged in: " + loggedIn);
      this.setState({loggedIn: loggedIn});
    }
    
    
  render() {
//    console.log(this.props.history);
//      console.log(history.location.pathname);
    return (
      <Router history={history}>
        <div className="App">
          <YSHeader setLoggedIn={this.setLoggedIn} loggedIn={this.state.loggedIn} parentData={this.getHeaderData}/>
          { (this.state.loggedIn) ? (
              <div>
                  <Route path="/parentHome" component={ParentHome} />
                  <Route path="/child/:childName" component={ChildDetail} />
                  <Route path="/transactions/:childName/:transactionId" component={EditTransaction} />
              </div>
            ) : (
              <div></div>
            )
          }
        </div>
      </Router>
    );
  }
}

export default App;


/*
ys01@0.1.0 /opt/node/node-v8.9.4-linux-x64/proj/ys01
├── ajv@6.2.1
├── ajv-keywords@3.1.0
├── create-react-class@15.6.3
├── dateformat@3.0.3
├── material-ui@0.20.0
├── moment@2.21.0
├── react@16.2.0
├── react-bootstrap@0.32.1
├── react-datepicker@1.2.2
├── react-dom@16.2.0
├── react-router-dom@4.2.2
└── react-scripts@1.1.1

to deploy:
run 
npm run eject
the *first* time, to get out of create-react-App
then, run
npm run build
to put the stuff in the build directory, and deploy from there.

modules:
react-bootstrap
react
dateformat
react-router-dom
datepicker

reCaptcha info:
yourstash.tr8.us
<script src='https://www.google.com/recaptcha/api.js'></script>
<div class="g-recaptcha" data-sitekey="6LfBrk4UAAAAAJKyKQwArDjY6jew0vsS-LuVY9Ar"></div>
secret key: 6LfBrk4UAAAAABXVHvZIs7DegfDlJqmA-059vimb
to check, send a post with
secret (id)
response (the 'g-recaptcha-response' from the form)
remoteip: users ip

recaptcha for anto.tr8.us:

Site key
Use this in the HTML code your site serves to users.
6LcXvk4UAAAAAIStTFNLc16VJV-1m2TdOQjLm8z3
Secret key
Use this for communication between your site and Google. Be sure to keep it a secret.
6LcXvk4UAAAAAGqdiR4w7UqPK3XAw7jH7uhD5P0y
Paste this snippet before the closing </head> tag on your HTML template:
<script src='https://www.google.com/recaptcha/api.js'></script>
Paste this snippet at the end of the <form> where you want the reCAPTCHA widget to appear:
<div class="g-recaptcha" data-sitekey="6LcXvk4UAAAAAIStTFNLc16VJV-1m2TdOQjLm8z3"></div>

forgot password:
the return from 


the Your-Stash client:

to create a new account: - may be either parent or child
click on New Account, opens a window where you can enter ParentName, ChildName, Password, Button: Create Account
Back will take you back to the previous page. CreateAccount will send a create account message, log in, and return to previous page

Register: protect against fraud. log the ip and time of each registration
requests should be associated with a verified email and ip and a key from the form, matching a httponly cookie
csrf cookie and header
min and max time limits
check for bad ips - vpn / proxy
http://check.getipintel.net/check.php?ip=173.244.48.20&contact=GeneKnight4@GMail.com&flags=m



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

How to confirm email address:
create a secret value, and store it in the user db
user account states: created, confirmed
Subject: Please Confirm YourStash Email Address
Thank you for joining Your Stash! Please click on the link below to confirm your account, *or* enter 12345 in the Register box.
http://yourstash.tr8.us/api/confirm/(in base64:)username/code

have to check if Parentname is unique! 1 second *after* the last change, check if name is taken
/api/usercheck/(username)

ToDo:
need to have confirmation message after confirm code is sent
enable recaptcha

REST interface:
in /open:
/login - present userName / password
/confirm - present userName, password / confirmCode, *or* use a GET with a coded URL with username / code
/register - present parentName, parentEmail, password - to create a new parent account
/ipcheck - check if recaptcha is necessary - coming from VPN
/passwordCheck - present password - check if a common password
/usercheck - present parentName to see if used
parentInfo object: parentName, parentEmail, confirmCode, password - could be used for all of these
in /api: all require the JWT Authorization Header
/users - GET - get the users with this account, parentName (gknight), userName (gknight/randol), userId
POST - create a new user under parent name: present userName, password receive a user object w/userId
DELETE - remove a user, present userId
PUT - update a user: present userId, userName, password
userObject: parentName, parentEmail, userName, password, userId, 
/transactions - GET get the transactions with this parentName account
POST - create a new transaction with userId, name, amount, date
DELETE - remove with transactionId
PUT - update with transactionId, name, amount, date
TransactionObject: name, amount, date, transactionId, user






*/
