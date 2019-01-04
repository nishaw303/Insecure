# Insecure

A final project for a security fundamentals course, meant to help us better understand web security and practices (cookies, http/https, requests) and show how easy it is for attackers to get user data.

### This extension was created for educational purposes ONLY. 

#### This chrome extension, when installed on a victim's browser, will do all of the following:
* Connect to an attacker controlled server without the victim's knowledge
* Leak previous browser history, and track all successive browsing data
* Install a listener to keep track of and steal usernames and passwords from login forms
* Redirect the victim away from attacker defined security websites (dynamically updatable)

The attacker controls a remote server that will show the online status of all users, and other information.

#### Once users are connected to the attacker's server:
* The attacker will be able to see which users are currently online
* All user brower history can be accessed, and can be sorted based on user
* All saved user logins can be seen and sorted by user
* The attacker and set JavaScript scripts to be injected into pages when a user visits them
* The attacker can update the list of security websites to redirect victims away from

#### Technologies used:
* Server uses Node.js
  - Requires: http, express, passport, socket.io, mysql
  - Connects to client using socket.io
  - Uses MySQL to store use info in database
* Client uses Chrome Extension APIs
  - Client depends on socket.io to connect to server
