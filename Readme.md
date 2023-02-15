# Memory Tutor
## Setup
This tool requires python3 and the Flask webframework. Furthermore clang-15 is required as a dependency.
## Running the Flask app in debug mode
Go into the app folder and run
```sh
. venv/bin/activate
```
to activate the environment. Now you can run the application using
```sh
flask run --host=<host-ip-address>
```
The last step is to set the correct host address inside app/static/js/index.js
## Memory layout input syntax
### Virtual tables
- *off(number)* for offset
- *vptr(number)* for virtual table pointer destinations
- *RTTI* for return type information
- method signatures
### Record layout
- *hasVptr* indicates if the record has a virtual table pointer
- *members* contains all members of a record
- *bases* and *virtual-bases* contain the (virtual) bases of a record

Example:
```json
{
    "hasVptr": true,
    "members": {
        "a": "int"
    }
    "bases": {
        "A": {
            ...
        }
    }
    "virtual-bases": {
        ...
    }
}
```
The outermost curly braces are omitted.