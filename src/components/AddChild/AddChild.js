import React, { Component } from "react";
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'// , Checkbox, Alert
import { po } from '../utils.js'
var SHA256 = require('crypto-js/sha256');

class AddChild extends Component {
    constructor(props){
        super(props);
        this.state={
            childName: "",
            password: ""
        }
        this.functionChange = this.functionChange.bind(this);
        
    }
    
    functionChange(e){
        switch(e.target.id){
            case "childName":
//                console.log("childname");
                this.setState({childName: e.target.value});
                break ;
            case "childPassword":
                this.setState({password: e.target.value});
                break ;
            case "addChild":
                console.log("add");
                this.sendAddChildPost(this);
                this.props.setOpen(false);
//                this.setState({password: e.target.value});
                break ;
            default:
                break;
        }
    }
    
    sendAddChildPost(that){ // jwt: {"alg":"HS512"}{"sub":"a","exp":1523371325}
//        console.log(SHA256(that.state.password).toString()); // 4e5bc14c80a9255305d82958b5d503bf75642a78993618f2b9506b9eb0a2e22d
        var url = "http://yourstash.tr8.us:6026/api/users";
//        let username = (that.state.username === "") ? that.state.parentName : that.state.parentName + "/" + that.state.username;
        var addChildInfo = {
            "username": that.state.childName,
            "password": SHA256(that.state.password).toString()
        }
        let postObj = po('POST', JSON.stringify(addChildInfo));
        postObj.headers.authorization = sessionStorage.getItem("auth") ;

        console.log(postObj);
//        console.log(pi);
        return fetch(url, postObj)
        .then(response => response.json().then(resp=>{
            console.log(resp);
        }))
/*            let err = true ;
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
            
        })) // parses response to JSON*/
    }
    
    
showAddChild(){
        return <div className="loginDiv">
        <h1 className="text-center">Add Child</h1>
    <form>
    <FormGroup>
    <ControlLabel className="loginLabel">Childname</ControlLabel>
    <FormControl
        type="text"
        id="childName"
        className="loginInput"
        value={this.state.childName}
        onChange={this.functionChange}
    />    
    <ControlLabel className="loginLabel">Password</ControlLabel>
    <FormControl
        type="password"
        id="childPassword"
        className="loginInput"
        value={this.state.password}
        onChange={this.functionChange}
    />    
        <Button id='addChild' className="loginButton" bsStyle="primary" onClick={this.functionChange}>Add Child</Button>
    
{/*    <FormControl
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
    <Button id='sendRegister' className="loginButton" bsStyle="primary" onClick={this.functionChange} 
        disabled={!this.state.isValid || this.state.needRecaptcha}>Create Account</Button>
    <Button id="showlogin" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Login</Button>
    <Alert bsStyle={this.state.validStyle}>{this.state.validMessage}</Alert>*/}
    </FormGroup>
    </form>
        </div>
    }

  render() {
      return this.showAddChild();
/*    return <div>
    this is addchild
    </div>;*/
  }
}

export default AddChild;
