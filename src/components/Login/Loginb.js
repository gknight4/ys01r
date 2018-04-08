
import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Button, Checkbox, Alert } from 'react-bootstrap'
import Recaptcha from 'react-google-recaptcha'
//import { AuthContext } from '../../AuthContext.js'
import { pi, po } from '../utils.js'
import './Login.css'
var SHA256 = require('crypto-js/sha256');

class Login extends Component {
    constructor(props){
        super(props);
//        console.log(React.version);
        this.state={
            parentName: "",
            checkedParentName: "",
            parentEmail: "",
            username: "",
            password: "",
            confirmPassword: "",
            confirmCode: "",
            showPassword: false,
            showmode: "login",
            rememberMe: true,
            showRecaptcha: false,
            recaptchaResponse: "",
            needRecaptcha: true,
            showLoginError: false,
            showAlert: false,
            showConfirm: false,
            alertStyle: "success",
            alertMessage: "The Account was Created",
            checkCountdown: 0,
//            checkState: 0,// 0-parentName not used, 1-duplicate, 2-ok
            showCheck: false,
            checkStyle: "success",
            checkMessage: "",
//            alertCheck: {aShow: true, aStyle: "success", aMessage: ""},
//            allertMessage: "",
            validMessage: "Please fill in the fields, and then click on Create Account",
            validStyle: "success",
            isValid: false,
            
            idTimer: 0
        }
        this.functionChange = this.functionChange.bind(this);
        this.recaptchaChange = this.recaptchaChange.bind(this);
//        this.parentName = React.createRef();
//        this.parentName = React.createRef();        
    }
    
/*    postData(url, data) {
//        var formData = new FormData();
//        formData.append('one', 'two');
//        console.log(formData);
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // 'one=two', // formData, // JSON.stringify({"one": "two"}),
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // *manual, follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.text().then(resp=>console.log("post response: " + resp))) // parses response to JSON
}*/

    recaptchaChange(e){
        console.log("recaptcha change");
        this.setState({recaptchaResponse: e, needRecaptcha: false}) ;
        console.log(this.state.recaptchaResponse);
    }
    
/*    po(method, body){
        var ret = {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }
        if (body !== "") ret.body = body ;
        return ret ;
    }*/
    
    setAlert(alert, show, style, message){
        alert.aShow = show ;
        alert.aStyle = style ;
        alert.aMessage = message ;
    }
    
    checkPasswordCommon(that){
        // this should be done as a POST, also, should use the hash
//        console.log("pn: " + this.state.parentName) ;
        var url = "http://yourstash.tr8.us:6026/open/passwordcheck/" + that.state.password;
        return fetch(url, po("GET", ""))
        .then(response => response.json().then(resp=>{
            this.setState({validMessage: resp.success ?
                "Your password must not be among the 1 million most popular passwords." :
                "Everything looks good! Go ahead and click Create Account."
            });
            that.setState({isValid: !resp.success});
        }))
    }
    
    checkParentnameNew(that){
//        console.log("pn: " + this.state.parentName) ;
        if (that.state.parentName.length === 0){
            that.setState({showCheck: false});
        } else {
            var url = "http://yourstash.tr8.us:6026/open/usercheck/" + that.state.parentName;
            return fetch(url, po("GET", ""))
            .then(response => response.json().then(resp=>{
                that.setState({
                    showCheck: true, 
                    checkStyle: resp.success ? "warning" : "success", 
                    checkMessage: resp.success ? 
                        "That name is already taken." :
                        "That name is available."
                });
                that.registerValidate(that);
            }))
        }
    }
    
    checkVpn(that){
        var url = "http://yourstash.tr8.us:6026/open/ipcheck";
        return fetch(url, po("GET", ""))
        .then(response => response.json().then(resp=>{// success means *is* vpn
            this.setState({showRecaptcha: resp.success, needRecaptcha: !resp.success});
        }))
    }
    
    saveAuth(that, userName, password, headers, rememberMe){
//        let headers = response.headers.get("Authorization") ;
//        pi.auth = headers ;
//        pi.userName = userName ;
//        pi.password = SHA256(password);
//        that.setState({jwtAuth: headers});
        that.props.parentData({loggedIn: true});
//        sessionStorage.setItem("username", userName) ;// I don't think these should be saved
//        sessionStorage.setItem("password", SHA256(password).toString()) ;
        sessionStorage.setItem("auth", headers) ;
        console.log("setting: " + headers);
        if(rememberMe){
            console.log("set local: " + userName);
            localStorage.setItem("username", userName) ;
            localStorage.setItem("password", SHA256(password).toString()) ;
        } else{
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        }
    }
    
/*
attacks:
XSS: inject malicious code into a website, that is then executed on the user's machine - urlencode all user fields
CSRF: causes the users browser to make a request to a site that he's already authenticated on - csrf tokens for forms
*/    
    
    sendConfirmationPost(that){
        var url = "http://yourstash.tr8.us:6026/open/confirm";
        var confirmInfo = {
            "parentname": that.state.parentName,
            "confirm": that.state.confirmCode,
            "password": SHA256(that.state.password).toString()
        }
        return fetch(url, po('POST', JSON.stringify(confirmInfo)))
        .then(response => response.json().then(resp=>{
            console.log("confirm response: " + resp);
//            console.log("headers");
//            console.log(response.headers);
//            console.log(response);
//            response.headers.forEach(head => console.log(head));
            if(resp.success) {
                this.saveAuth(that, 
                    that.state.parentName,
                    that.state.password,
                    response.headers.get("Authorization"), 
                    false);
                this.setState({alertMessage: "Your Confirmation Code has been accepted, and you have been logged in. Thanks!"});
            }
//            let headers = response.headers.get("Authorization") ;
//            pi.auth = headers ;
//            that.setState({jwtAuth: headers});
//            that.props.parentData({auth: headers, loggedIn: true});
//            console.log("auth: " + response.headers.get("Authorization"));
//            for (var key of response.headers.keys()) console.log(key);
            
        })) // parses response to JSON Authorization 273414
    }
    
    testParentData(){
        this.props.parentData({auth: "login data"});// send up to YsHeader
        console.log(pi.auth) ;
//        <AuthContext
//        console.log("login data");
    }
    
    sendLoginPost(that){ // jwt: {"alg":"HS512"}{"sub":"a","exp":1523371325}
//        console.log(SHA256(that.state.password).toString()); // 4e5bc14c80a9255305d82958b5d503bf75642a78993618f2b9506b9eb0a2e22d
        var url = "http://yourstash.tr8.us:6026/open/login";
        let username = (that.props.username === "") ? that.state.parentName : that.state.parentName + "/" + that.state.username;
        var loginInfo = {
            "username": username,
            "password": SHA256(that.state.password).toString()
        }
        return fetch(url, po('POST', JSON.stringify(loginInfo)))
        .then(response => response.json().then(resp=>{
            let err = true ;
//            console.log(resp);
            if (resp.success){
                this.saveAuth(that, 
                    username,
                    that.state.password,
                    response.headers.get("Authorization"), 
                    this.state.rememberMe);
                err = false ;
                this.props.setOpenC(false);
            }
            this.setState({showLoginError: err});
            
        })) // parses response to JSON
    }
    

    
    sendRegisterPost(that){
        var url = "http://yourstash.tr8.us:6026/open/register";
        var registerInfo = {
            "parentName": that.state.parentName,
            "parentEmail": that.state.parentEmail,
            "password": SHA256(that.state.password).toString(),
            "recaptcha": that.state.recaptchaResponse
        }
        return fetch(url, po('POST', JSON.stringify(registerInfo)))
/*                     {
            body: JSON.stringify(registerInfo), // 'one=two', // formData, // JSON.stringify({"one": "two"}),
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })*/
        .then(response => response.json().then(resp=>{
            
            if (resp.success){
                this.setState({
                    showAlert: true, 
                    alertStyle: "success", 
                    alertMessage: "The Account was Created. Check your email, and click on the link there to confirm your address. Or enter the code here:",
                    showConfirm: true
                }) ;
               
            } else{
                this.setState({showAlert: true, alertStyle: "danger", alertMessage: "That Account already exists"}) ;
            }
                
//            console.log(resp.success) ;
        })) // parses response to JSON
        
//        postData("http://yourstash.tr8.us:8080/api/register", registerInfo);
//        console.log("post");
//        console.log(registerInfo);
/*        fetch("http://yourstash.tr8.us/post", {
            credentials: 'same-origin', // include, same-origin, *omit
            method: 'POST',
            mode: 'cors',
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer' // *client, no-referrer            
        }).then(resp => console.log(resp));*/
    }
    
    componentWillMount(){
        this.checkVpn();
//        console.log("check vpn");
//        console.log("will mount");
    }
    
/*    componentDidMount(){
//        this.parentName.focus();
        console.log("did mount");
//        this.parentName.focus();
//        if (this.parentName.current != null) this.parentName.current.focus();
    }
    
    componentWillReceiveProps(){
        console.log("componentWillReceiveProps");
    }
    
    shouldComponentUpdate(){
        console.log("shouldComponentUpdate");
        return true ;
    }
    
    componentWillUpdate(){
        console.log("componentWillUpdate");
    }
    
    componentDidUpdate(){
        console.log("componentDidUpdate");
//        if (this.parentName.current != null) this.parentName.current.focus();
//        console.log(this.parentName);
//        if (this.parentName != null) {
//            console.log("not null");
//            this.parentName.focus();
//        }
    }
    
    componentWillUnmount(){
        console.log("componentWillUnmount");
    }*/


    registerValidate(that){
        function checkChar (inString, inChar){
            return (inString.indexOf(inChar) > -1);
//            return true ;
        }
/*
messages:
Please fill in the fields, and then click on Create Account.
Your Parentname cannot include these symbols: <, >, (space)
Your Parentname cannot have more than 32 characters
Your Parentname has to be unique.
Please enter a valid email address.
Your password must have at least 8 characters and include all of these: capital, lower case, numeric digit, and symbol (eg. Sun23day*);
Your password must not be among the 1 million most popular passwords.
*/   
    this.setState({isValid: false});
    let chars = ["<", ">", " "] ;
    let caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lc = "abcdefghijklmnopqrstuvwxyz";
    let digits = "0123456789";
    let symbols = "!@#$%^&*()`~-_=+[{]}\\|;:,./?";
    let gotCaps = false ;
    let gotLc = false ;
    let gotSymbol = false ;
    let gotDigit = false ;

/* Check parentName */  
console.log("validate");
        if((that.state.parentName.length===0) || (that.state.parentEmail.length===0) || (that.state.password.length===0)) {
//            that.showValid(that, "Please fill in the fields, and then click on Create Account.");
            that.setState({validMessage: "Please fill in the fields, and then click on Create Account."});
            return ;

        }
//        console.log(chars.length + ", " + that.state.parentName.indexOf(chars[0]));
        for (let i = 0 ; i < chars.length ; i++){
            if(that.state.parentName.indexOf(chars[i]) >= 0) {
//                console.log("chars");
                that.setState({validMessage: "Your Parentname cannot include these symbols: <, >, (space)."});
                return ;
            }
        }
            
        if (that.state.parentName.length >= 32) {
            that.setState({validMessage: "Your Parentname cannot have more than 32 characters."});
            return ;
        }
        if (that.state.checkStyle === 'warning') {
            that.setState({validMessage: "Your Parentname has to be unique."});
            return ;
        }
/* Check email */        
        let per = that.state.parentEmail.lastIndexOf(".") ;
        let at = that.state.parentEmail.indexOf("@") ;
        let emailOk = ((per > -1) && (at > -1) && (per > at)) ;
//        console.log(per + ", " + at + ", " + emailOk);
        if (!emailOk) {
            that.setState({validMessage: "Please enter a valid email address."});
            return ;
        }
/* Check password */        
        for (let i = 0 ; i < caps.length ; i++) gotCaps |= checkChar(this.state.password, caps.charAt(i));
        for (let i = 0 ; i < lc.length ; i++) gotLc |= checkChar(this.state.password, lc.charAt(i));
        for (let i = 0 ; i < digits.length ; i++) gotDigit |= checkChar(this.state.password, digits.charAt(i));
        for (let i = 0 ; i < symbols.length ; i++) gotSymbol |= checkChar(this.state.password, symbols.charAt(i));
        let passOk = ((this.state.password.length >= 8) && gotCaps && gotLc && gotDigit && gotSymbol) ;
//        console.log(gotCaps + ", " + gotLc + ", " + gotDigit + ", " + gotSymbol + ", " + this.state.password + ", " + this.state.password.length + ", " + passOk);
        if (!passOk){
            that.setState({validMessage: 
                "Your password must have at least 8 characters and include all of these: capital, lower case, numeric digit, and symbol (eg. Sun23day*);"});
            return ;
        }
        if (!this.state.showPassword){
            if (this.state.password !== this.state.confirmPassword){
                that.setState({validMessage:
                    "The two passwords must match."
                });
                return;
            }
        }
        this.checkPasswordCommon(that);
            
            
    }

    tickTimer(that){
        
        var count = that.state.checkCountdown - 1 ;
        that.setState({checkCountdown: count});
        if (count <= 0) {
            clearInterval(that.state.idTimer);
            that.setState({idTimer: 0});
            if ((that.state.parentName.length > 0) && (that.state.parentName !== this.state.checkedParentName)){
                that.checkParentnameNew(that);
                that.setState({checkedParentName: this.state.parentName});
            }
            this.registerValidate(that);
        }
//        console.log("tick: " + count);
    }

    startCheckTimer(){
        console.log("start2");
        this.setState({checkCountdown: 10});
        if (this.state.idTimer === 0) {
            this.setState ({idTimer: setInterval(e => this.tickTimer(this), 100)}) ;
        }
    }

    
    functionChange(e){
//        console.log(this.props.myopen);
        switch(e.target.id){
            case "parentName":
                this.setState({parentName: e.target.value});
                break;
            case "parentNameRegister":
                this.setState({parentName: e.target.value});
//                console.log("start1");
                this.startCheckTimer();
//                this.registerValidate(this);
                break;
            case "parentEmail":
                this.setState({parentEmail: e.target.value});
                this.startCheckTimer();
//                this.registerValidate(this);
                break;
            case "username":
                this.setState({username: e.target.value});
                break;
            case "password":
                this.setState({password: e.target.value});
                this.startCheckTimer();
//                this.registerValidate(this);
                break ;
            case "confirmpassword":
                this.setState({confirmPassword: e.target.value});
                this.startCheckTimer();
//                this.registerValidate(this);
                break ;
            case "confirmCode":
                this.setState({confirmCode: e.target.value});
                break ;
            case "showregister":
                this.setState({showmode: "register"});
                break ;
            case "showlogin":
                this.setState({showmode: "login"});
//                this.testParentData(this)
                break ;
            case "rememberMe":
                this.setState({rememberMe: !this.state.rememberMe});
                break ;
            case "sendRegister":
                this.sendRegisterPost(this);
                break;
            case "sendConfirmation":
                this.sendConfirmationPost(this);
                break;
            case "sendLogin":
                this.sendLoginPost(this);
                break;
            case "showPassword":
                this.setState({showPassword: !this.state.showPassword});
                break ;
            default:
                break ;
        }
//        console.log(e.target.id);
    }
    
/*********************  Register  ********************************/    
   
    showRegister(){
        return <div className="loginDiv">
        <h1 className="text-center">Register</h1>
    <form>
    <FormGroup>
    <ControlLabel className="loginLabel">Parentname</ControlLabel>
    <FormControl
//        autoFocus
//        ref={this.parentName}
//        inputRef={ref => { this.input = ref; }} 
        type="text"
        id="parentNameRegister"
        className="loginInput"
        value={this.state.parentName}
        onChange={this.functionChange}
    />
    { (this.state.showCheck) &&
        <div>
        <Alert bsStyle={this.state.checkStyle}>{this.state.checkMessage}</Alert>
        </div>
    }
    <ControlLabel className="loginLabel">Parent Email</ControlLabel>
    <FormControl
        type="text"
//        ref={ 'input' + this.props.line }
        id="parentEmail"
        className="loginInput"
        value={this.state.parentEmail}
        onChange={this.functionChange}
    />
    <Checkbox id="showPassword" checked={this.state.showPassword} onChange={this.functionChange}>Show Password (and skip Confirm!)</Checkbox>
    <ControlLabel className="loginLabel">Password</ControlLabel>
    <FormControl
        type={this.state.showPassword ? "text" : "password"}
        id="password"
        className="loginInput"
        value={this.state.password}
        onChange={this.functionChange}
    />
    {!this.state.showPassword &&
        <div>
            <ControlLabel className="loginLabel">Confirm Password</ControlLabel>
            <FormControl
                type="password"
                id="confirmpassword"
                className="loginInput"
                value={this.state.confirmPassword}
                onChange={this.functionChange}
            />
        </div>
    }
    { this.state.showRecaptcha &&
        <div>
            <Alert bsStyle={"info"}>You seem to be using a VPN. Please confirm your humanity:</Alert>
            <Recaptcha sitekey="6LfBrk4UAAAAAJKyKQwArDjY6jew0vsS-LuVY9Ar" onChange={this.recaptchaChange}/>
        </div>
    }
    {this.state.showAlert &&
        <Alert bsStyle={this.state.alertStyle}>{this.state.alertMessage}</Alert>
    }
    {this.state.showConfirm &&
        <div>
        <ControlLabel className="loginLabel">Confirmation Code</ControlLabel>
        <FormControl
            type="text"
            id="confirmCode"
            className="loginInput"
            value={this.state.confirmCode}
            onChange={this.functionChange}
        />
        <Button id='sendConfirmation' className="loginButton" bsStyle="primary" onClick={this.functionChange}>Confirm Account</Button>
        </div>
    }
    {!this.state.showConfirm &&
        <div>
            <Button id='sendRegister' className="loginButton" bsStyle="primary" onClick={this.functionChange} 
                disabled={!this.state.isValid || this.state.needRecaptcha}>Create Account</Button>
            <Button id="showlogin" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Login</Button>
            <Alert bsStyle={this.state.validStyle}>{this.state.validMessage}</Alert>
        </div>
    }
    </FormGroup>
    </form>
        </div>
    }
/*********************  Login  ********************************/    
    
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
        id="username"
        className="loginInput"
        value={this.state.username}
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
    
  render() {
      switch (this.state.showmode){
          case "login":
              return this.showLogin();
          case "register":
              return this.showRegister();
          default:
              break ;
            
      }
  }
}

export default Login;
