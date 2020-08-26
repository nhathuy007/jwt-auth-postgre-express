## JWT Authentication + PostgresQL + Express

This is a simple demo of JWT Authentication with Express and Node.js

## Installation
Install all the require package.
```bash
$ npm install 
```
Setup the Environment:

1. Execute the postgresql script.
2. Change the information of Postgresql in ```db.js ``` file.
3. Change the Express server port to the desire port in ``server.js`` file.


## Usage

Run the server:
```bash
$ npm start
```
Main functions:

## 1. User Registration:
This function will help user to register for an account. It will take a JSON Object with data listed below.
```bash
localhost:{your_port}/users/register
```
Parameter:  JSON Object. 

E.g:  {
    "Email" : "email@example.com",
    "Name": "Demo",
    "Password": "Password"
}

## 2. Login:
This function will verify the email and password then it will return a jwt token for further action.
```bash
localhost:{your_port}/users/login
```
Parameter:  JSON Object. 

E.g:  {
    "Email" : "email@example.com",
    "Password": "Password"
}

Return: JWT Token

E.g: {
    "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJl..."
}

## 3. Create New Group:
This function allow user to create new group by group name. The group name is not unique. It will verify the user token before granting the access for user.
```bash
localhost:{your_port}/users/create-group
```
Parameter:  
- "auth-token" : Authentication token included in the header.
- JSON Object. 

E.g:  {
     "GroupName" : "GroupNew1"
}


## 4. Add Member To Group:
This function allow user to add another user to the group by group id. It will also verify the user token before granting the access for user.
```bash
localhost:{your_port}/users/add-to-group
```
Parameter:  
- "auth-token" : Authentication token included in the header.
- JSON Object. 

E.g:  {
     "GroupID" : 11,
    "Email": "test332"
}

## 5. View All Groups:
This function will list all the current group that belong to this current user.
```bash
localhost:{your_port}/users/view-all-groups
```
Parameter:  
- "auth-token" : Authentication token included in the header. 

## 6. View Group Members:
This function will list all the current member in specific group.
```bash
localhost:{your_port}/users/view-group-member/:id
```
Parameter:  
- id: id of the group.
- "auth-token" : Authentication token included in the header. 



## Contributing
This is just a simple demo. Feel free to make any changes on this.

## License
[MIT](https://choosealicense.com/licenses/mit/)
