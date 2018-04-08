import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Button, Checkbox, Alert } from 'react-bootstrap'
import Recaptcha from 'react-google-recaptcha'
//import { AuthContext } from '../../AuthContext.js'
import { po, saveAuth } from '../utils.js'// pi, 
import './Login.css'
var SHA256 = require('crypto-js/sha256');

class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      parentName: "",
      parentEmail: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      confirmCode: "",
      showCheck: false,
      idTimer: 0
    }
    this.functionChange = this.functionChange.bind(this);
  }
  
  functionChange(e){
    switch(e.target.id){
      case "parentName":
        this.setState({parentName: e.target.value});
        this.startCheckTimer();
        break ;
      case "parentEmail":
        this.setState({parentEmail: e.target.value});
        this.startCheckTimer();
        break ;
      case "password":
        this.setState({password: e.target.value});
        this.startCheckTimer();
        break ;
      case "showPassword":
        this.setState({showPassword: !this.state.showPassword});
        this.startCheckTimer();
        break ;
      case "confirmpassword":
        this.setState({confirmPassword: e.target.value});
        this.startCheckTimer();
        break ;
      case "confirmCode":
        this.setState({confirmCode: e.target.value});
        break ;
      case "sendRegister":
        this.sendRegisterPost(this);
        break;
      case "sendConfirmation":
        this.sendConfirmationPost(this);
        break;
      default:
        break ;
    }
  }
  
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
    
    sendRegisterPost(that){
        var url = "http://yourstash.tr8.us:6026/open/register";
        var registerInfo = {
            "parentName": that.state.parentName,
            "parentEmail": that.state.parentEmail,
            "password": SHA256(that.state.password).toString(),
            "recaptcha": that.state.recaptchaResponse
        }
        return fetch(url, po('POST', JSON.stringify(registerInfo)))
        .then(response => response.json().then(resp=>{
            if (resp.success){
                this.setState({
                    showAlert: true, 
                    alertStyle: "success", 
                    alertMessage: "The Account was Created. Check your email, and click on the link there to confirm your address. Or enter the code here, and you'll be automatically logged in:",
                    showConfirm: true
                }) ;
               
            } else{
                this.setState({showAlert: true, alertStyle: "danger", alertMessage: "That Account already exists"}) ;
            }
        })) // parses response to JSON
    }

    sendConfirmationPost(that){
        var url = "http://yourstash.tr8.us:6026/open/confirm";
        var confirmInfo = {
            "parentname": that.state.parentName,
            "confirm": that.state.confirmCode,
            "password": SHA256(that.state.password).toString()
        }
        console.log(confirmInfo);
        return fetch(url, po('POST', JSON.stringify(confirmInfo)))
        .then(response => response.json().then(resp=>{
            console.log("confirm response: ");
            console.log(resp) ;
            console.log("head: " + response.headers.get("Authorization"));
            if(resp.success) {
                saveAuth(that.state.parentName,
                    that.state.password,
                    response.headers.get("Authorization"), 
                    false);
                this.setState({alertMessage: "Your Confirmation Code has been accepted, and you have been logged in. Thanks!"});
                this.props.setLoggedIn(true);
            }
        })) // parses response to JSON Authorization 273414
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
//        console.log("start2");
        this.setState({checkCountdown: 10});
        if (this.state.idTimer === 0) {
            this.setState ({idTimer: setInterval(e => this.tickTimer(this), 100)}) ;
        }
    }

    
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
        id="parentName"
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

  render(){
    return this.showRegister();
  }
 
}

export default Register;
