
import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Button, Checkbox, Alert } from 'react-bootstrap'
//import Recaptcha from 'react-google-recaptcha'
//import { AuthContext } from '../../AuthContext.js'
import { po, saveAuth } from '../utils.js'// pi, 
import './Login.css'
var SHA256 = require('crypto-js/sha256');

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      parentName: "",
      userName: "",
      password: "",
      rememberMe: false
    };
    this.functionChange = this.functionChange.bind(this);
  }
  
  functionChange(e){
    switch(e.target.id){
      case "parentName":
        this.setState({parentName: e.target.value});
        break ;
      case "userName":
        this.setState({userName: e.target.value});
        break ;
      case "password":
        this.setState({password: e.target.value});
        break ;
      case "rememberMe":
        this.setState({rememberMe: !this.state.rememberMe});
        break ;
      case "sendLogin":
          this.sendLoginPost(this);
          break;
      case "showregister":
//          this.setState({showmode: "register"});
//        console.log(this.props);
          this.props.setLoginComponent("register");
          break ;
      default:
        break ;
    }
  }
  
    sendLoginPost(that){ // jwt: {"alg":"HS512"}{"sub":"a","exp":1523371325}
        var url = "http://yourstash.tr8.us:6026/open/login";
        let username = (that.state.userName === "") ? that.state.parentName : that.state.parentName + "/" + that.state.userName;
        var loginInfo = {
            "username": username,
            "password": SHA256(that.state.password).toString()
        }
        console.log(loginInfo);
        return fetch(url, po('POST', JSON.stringify(loginInfo)))
        .then(response => response.json().then(resp=>{
            let err = true ;
//            console.log(resp);
            if (resp.success){
                saveAuth(username,
                    that.state.password,
                    response.headers.get("Authorization"), 
                    this.state.rememberMe);// took out that
                err = false ;
                this.props.setOpen(false);
            }
            this.setState({showLoginError: err});
            this.props.setLoggedIn(resp.success);
        })) // parses response to JSON
    }
    
  
  
    showLogin(){
    return <div className="loginDiv">
    <h1 className="text-center">Login</h1>
    <form>
    <FormGroup>
    <ControlLabel className="loginLabel">Parentname</ControlLabel>
    <FormControl
//        autoFocus
//        ref={this.parentName}
        type="text"
        id="parentName"
        className="loginInput"
        value={this.state.parentName}
        onChange={this.functionChange}
    />
    <ControlLabel className="loginLabel">Username</ControlLabel>
    <FormControl
        type="text"
        id="userName"
        className="loginInput"
        value={this.state.userName}
        onChange={this.functionChange}
    />
    <ControlLabel className="loginLabel">Password</ControlLabel>
    <FormControl
        type="password"
        id="password"
        className="loginInput"
        value={this.state.password}
        onChange={this.functionChange}
    />
    { this.state.showLoginError &&
        <Alert bsStyle={"danger"}>{"The Parentname, Username, or Password is incorrect."}</Alert>

        
    }
    <Button id="sendLogin" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Login</Button>
    <Checkbox id="rememberMe" checked={this.state.rememberMe} onChange={this.functionChange}>Remember Me</Checkbox>
    <Button id="forgotPassword" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Forgot Password</Button>
    <p>New Here?</p>
    <Button id="showregister" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Register</Button>
    
    </FormGroup>
    
    </form>
    </div>;
        
    }
  
  render(){
    return this.showLogin();
  }
}

export default Login;
