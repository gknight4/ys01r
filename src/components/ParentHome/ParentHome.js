import React, { Component } from "react";
import { FormGroup } from 'react-bootstrap' // ControlLabel, FormControl, , Checkbox, Alert, Button
//import ChildBalance from '../ChildBalance/ChildBalance.js'
import { po } from '../utils.js'
import { Link } from 'react-router-dom'

class ParentHome extends Component {
constructor (props){
    super(props);
    this.state={
        users: null,
        transactions: null
    }
    this.functionChange = this.functionChange.bind(this);
    
}

    componentWillMount(){
//        console.log("will mount");
        this.getChildren();
    }
    
/*    componentDidMount(){
        console.log("did mount");
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
    }
    
    componentWillUnmount(){
        console.log("componentWillUnmount");
    }*/


functionChange(e){
    switch(e.target.id){
        case "addChild":
            console.log("addchild");
            break ;
        default:
            break ;
    }
}

    getChildren(){// called from WillMount
//        console.log("get children") ;
        let url = "http://yourstash.tr8.us:6026/api/users";
        let getObj = po('GET', '');
        getObj.headers['Authorization'] = sessionStorage.getItem("auth");
        fetch(url, getObj)
            .then(response => {
                response.json()
                    .then(resp => {
//                      console.log(resp);
                        if (this.state.users == null){
                            this.setState({users: resp});// causes re-render!
                        }
                    })
            });
        url = "http://yourstash.tr8.us:6026/api/transactions";
        getObj = po('GET', '');
        getObj.headers['Authorization'] = sessionStorage.getItem("auth");
        fetch(url, getObj)
            .then(response => {
                response.json()
                .then(resp=>{
                    if (this.state.transactions == null) {
                        this.setState({transactions: resp})
//                        console.log(resp);
                    }
                })
            });
    }
    
getUsers(){
    if(this.state.users !== null){
      let users = [];
      for (let i = 0 ; i < this.state.users.length ; i++){
          let user = this.state.users[i] ;
          let name = user.username ;
          let pos = name.lastIndexOf("/");
          if (pos >= 0) {
            users["u" + user.id] = name.substr(1 + pos) ;
          }
      }
//      console.log(users);
      return users ;
  //    console.log(users.u52);
    }
}
    
getUsersO(){
    let users = [];
    for (let i = 0 ; i < this.state.transactions.length ; i++){
        let user = this.state.transactions[i].user ;
        let name = user.username ;
        
//        console.log(this.state.transactions[i].user);
        users["u" + user.id] = name.substr(1 + name.lastIndexOf("/")) ;
    }
    return users ;
//    console.log(users.u52);
}

getBalance(id){// return the lines *and* the balance
//    let id = parseInt(uid.substr(1), 10);
    let balance = 0 ;
    let detailLines = [] ;
    for (let i = 0 ; i < this.state.transactions.length ; i++){
        let trans = this.state.transactions[i] ;
//        console.log(trans);
        let user = trans.user ;
        if (id === user.id){
            balance += trans.amount ;
            detailLines.push(trans);
        }
    }
//    console.log(id);
    return {bal: balance, trans: detailLines} ;
}


showChildren(){// children of logged-in parent
//    this.getChildren();
    let childrenLines = [] ;
    if ((this.state.transactions !== null)){
//        console.log("ready");
        let users = this.getUsers();
//        console.log(users);
        let i = 0 ;
        for (let prop in users){
            let id = parseInt(prop.substr(1), 10);
            let detail = this.getBalance(id) ;
//            console.log(detail);
            childrenLines[i] = <div key={i}>
            <Link to={"/child/" + users[prop]}>{users[prop]}</Link> {"$" + (detail.bal / 100)}
            </div>
            i = i+1 ;
        }
    }
    
    return childrenLines ; // <div>this is show children</div>
}


render() {
    return <div>
    <form>
    <FormGroup>
    <h1>Child Balances</h1>
        {this.showChildren ()}
{/*      <ChildBalance ysparent={'gknight4'} yschild={'charlie'}/>
      <ChildBalance ysparent={'gknight4'} yschild={'randol'}/>*/}
    
    </FormGroup>
    </form>
    </div>;
  }
}

export default ParentHome;

/*
get /api/users with username token, and just get *our* kids

 * 
*/
