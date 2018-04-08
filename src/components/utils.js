var SHA256 = require('crypto-js/sha256');

/*const postJson = function(url, jsonObj){
  var url2 = "http://dads.startap.com/api" + url ;
}*/

/*const test1 = function(){
    console.log("test1");
    fetch("http://localhost:8080/api/users/6", {
        method: 'GET',
        mode: 'cors'
    }).then(resp => resp.json().then(exp=>console.log(exp)));
// make a rest request
    // url = localhost:8080/api/users
}*/

const po = function (method, body){
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
    }

const myFunc = function () {

  fetch("http://dads.startap.com/test.json", {
    body: JSON.stringify({"one": "thing"}), // must match 'Content-Type' header
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
  .then(response => response.json().then(exp => console.log(exp))) // parses response to JSON

/*  var url = "http://localhost";
  var params = {
    method: 'GET',
    headers:{
      'Access-Control-Allow-Origin': '*'
    }
  }
  fetch('http://localhost/icon.ico', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstParam: 'yourValue',
      secondParam: 'yourOtherValue',
    })
  })*/
//  fetch(url, params).then(resp => {console.log(resp)})

  return 6 ;
}

const myFunc2 = function () {
  return 7 ;
}

var saveIt = -5 ;

const setSave = function (val){
    saveIt = val ;
}

const getSave = function (){
    return saveIt ;
}

class PI {
    auth: ""
}

    const saveAuth = function(userName, password, headers, rememberMe){
        console.log("saveAuth headers setting: " + headers);
      if (headers === ""){
        sessionStorage.removeItem("auth");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      } else {
        sessionStorage.setItem("auth", headers) ;
        if(rememberMe){
            console.log("set local: " + userName);
            localStorage.setItem("username", userName) ;
            localStorage.setItem("password", SHA256(password).toString()) ;
        } else{
            localStorage.removeItem("username");
            localStorage.removeItem("password");
        }
      }
    }
    


export { po, myFunc, myFunc2, setSave, getSave, saveAuth } ;
export let pi = new PI();

/*

fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
})
*/
