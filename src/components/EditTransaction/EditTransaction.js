import React, { Component } from "react";
import {FormControl, FormGroup,
  ControlLabel, Button} from 'react-bootstrap';
import DatePicker from 'react-datepicker'
//import Moment from 'react-moment'
import moment from 'moment'
import './react-datepicker.css'
import history from '../../history.js'
import { po } from '../utils.js'
import '../Login/Login.css'

class EditTransaction extends Component {
  constructor(props){
    super(props);
    this.state = {
      ysId: props.match.params.transactionId,
//      ysName: "some trans",
//      ysDate: moment(new Date()),
      ysAmount: 123.45,
      ysChild: "charlie",
      transaction: {name: "", date: "", amount: 0, user: {username: ""}}

    };
    this.functionChange = this.functionChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    "value": 0,
    "ysDate": moment(new Date())
  } ;

loadTrans(){
//    console.log(this.props);
//    console.log("loading");
//    let path = this.props.location.pathname ;
//    let transId = path.substr(path.lastIndexOf("/") + 1) ;
    if (this.props.match.params.transactionId === "new"){
        this.setState(
            {transaction: {
                date: new Date(),
                name: "a new one",
                user: {username: this.props.match.params.childName}
            },
            ysAmount: 0
        });
    } else {
        let url = "http://yourstash.tr8.us:6026/api/transactions/" + this.props.match.params.transactionId;
        let getObj = po('GET', '');
        getObj.headers['Authorization'] = sessionStorage.getItem("auth");
        fetch(url, getObj)
            .then(response => {
                if (response !== ""){
                    response.json()
                    .then(resp=>{
                        this.setState({transaction: resp.transaction, ysAmount: resp.transaction.amount / 100})
                    })
                }
            });
    }
}

deleteTrans(callback){
  let transId = this.props.match.params.transactionId ;
  let url = "http://yourstash.tr8.us:6026/api/transactions/" + transId ;
  let getObj = po('DELETE', '');
  getObj.headers['Authorization'] = sessionStorage.getItem("auth");
  fetch(url, getObj)
    .then(response => {
      if (response !== ""){
        response.json()
        .then(resp=>{
          console.log(resp);
          callback();
        })
      }
    });
}
  
copyTrans(callback){
//  let transId = this.props.match.params.transactionId ;
  let url = "http://yourstash.tr8.us:6026/api/transactions/" ;
  let getObj = po('POST', '');
  getObj.headers['Authorization'] = sessionStorage.getItem("auth");
  let trans = this.state.transaction ;
  trans.date = new Date();
  trans.amount = parseInt(this.state.ysAmount * 100, 10);
  trans.user.username = this.props.match.params.childName ;
  getObj.body = JSON.stringify(trans) ;
  fetch(url, getObj)
    .then(response => {
      if (response !== ""){
        response.json()
        .then(resp=>{
          console.log(resp);
          callback();
        })
      }
    });
}
  
  sendTrans(callback){
        let transId = this.props.match.params.transactionId ;
        if (transId === "new"){
//            console.log("new");
            let url = "http://yourstash.tr8.us:6026/api/transactions/" ;
            let getObj = po('POST', '');
            getObj.headers['Authorization'] = sessionStorage.getItem("auth");
            let trans = this.state.transaction ;
            trans.amount = parseInt(this.state.ysAmount * 100, 10);
            trans.user.username = this.props.match.params.childName ;
//            console.log(trans);
            getObj.body = JSON.stringify(trans) ;
            fetch(url, getObj)
                .then(response => {
                    if (response !== ""){
                        response.text()
                        .then(resp=>{
                            console.log(resp);
                            callback();
                        })
                        
                    }
                });
        } else {
            let url = "http://yourstash.tr8.us:6026/api/transactions/" + transId ;
            let getObj = po('PUT', '');
            getObj.headers['Authorization'] = sessionStorage.getItem("auth");
//            console.log(this.state.transaction);
            let trans = this.state.transaction ;
            trans.amount = parseInt(this.state.ysAmount * 100, 10);
            getObj.body = JSON.stringify(trans) ;
            fetch(url, getObj)
                .then(response => {
                    if (response !== ""){
                        response.text()
                        .then(resp=>{
                        })
                        
                    }
                });
        }
}
  
  getChildName(){
      let uname = this.state.transaction.user.username ;
      return uname.substr(1 + uname.lastIndexOf("/")) ;
  }

  componentWillMount(){
        this.loadTrans();
    }

  getValidationState = function (){

  }
  
  linkToChildDetail(that){
    history.push("/child/" + that.props.match.params.childName);
  }
  
  functionChange(e){
      var trans, name ;
      switch(e.target.id){
          case "transName":
              trans = this.state.transaction;
              trans.name = e.target.value ;
            this.setState({transaction: trans});
            break ;
          case "transAmount":
//                trans = this.state.transaction;
//                let val = e.target.value ;
//                if (val.indexOf('.') val += '0');
//                let newAmt = parseInt(100 * e.target.value, 10) ;
//                if (!isNaN(newAmt)) trans.amount =  newAmt;
                this.setState({ysAmount: e.target.value});
            break ;
          case "submit":
//              console.log("sub");
            name = this.props.match.params.childName ;
              this.sendTrans(function(){
              history.push("/child/" + name);
            });
              break ;
          case "delete":
//            console.log(this.props.match.params.childName);
            name = this.props.match.params.childName ;
            this.deleteTrans(res => this.linkToChildDetail(this));
            break ;
          case "copy":
            this.copyTrans(res => this.linkToChildDetail(this));
            break ;
          case "cancel":
            this.linkToChildDetail(this) ;
            break ;
          default:
              break;
      }
  }

  handleNameChange(event) {
    this.setState({ysName: event.target.value});
  }

  handleDateChange(event) {
    let trans = this.state.transaction;
    trans.date = event ;
    this.setState({transaction: trans});
//    console.log(event.toDate());
//    this.setState({ysDate: event});
  }

  handleAmountChange(event) {
    this.setState({ysAmount: event.target.value});
  }

  handleSubmit(event) {
    console.log("submit");
    alert('A name was submitted: ' + this.state.ysName);
    event.preventDefault();
    history.push('/');
  }
  render() {
//    console.log(this.state.ysDate);
    return (
        <div>
        <h2>Edit Transaction for {this.props.match.params.childName}</h2>
      <form onSubmit={this.handleSubmit}>
        <FormGroup
//          controlId="formBasicText"
          validationState={this.getValidationState()}
        >
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            id="transName"
            value={this.state.transaction.name}
            placeholder="Enter text"
            onChange={this.functionChange}
          />
          <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
          <ControlLabel>Date</ControlLabel>
          <DatePicker
          id="transDate"
            selected={moment(new Date(this.state.transaction.date))}
            onChange={this.handleDateChange}
          />
        </FormGroup>
        <FormGroup>
        <ControlLabel>Amount</ControlLabel>
          <FormControl
            type="text"
            id="transAmount"
            value={this.state.ysAmount}
            placeholder="amount"
            onChange={this.functionChange}
          />
        </FormGroup>
        <Button id="submit" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Submit</Button>
        <Button id="copy" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Copy</Button>
        <Button id="delete" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Delete</Button>
        <Button id="cancel" className="loginButton" bsStyle="primary" onClick={this.functionChange}>Cancel</Button>
      </form>
        </div>
    );
  }
}

export default EditTransaction;
