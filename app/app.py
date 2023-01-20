from flask import Flask, redirect, url_for, request
import json
import sys
import subprocess
import binascii
import os

from cldump_parser import parse_vtables

app = Flask(__name__)

@app.route("/")
def index():
    return redirect('/static/index.html')

@app.route("/solution", methods=['POST'])
def login():
    f = open("temp/source.cpp", "w")
    f.write(request.data.decode('utf-8'))
    f.close()

    try:
        vtable_out = subprocess.check_output(f"clang-15 -cc1 -fdump-vtable-layouts -emit-llvm temp/source.cpp", shell=True)
    except subprocess.CalledProcessError as e:
        return json.dumps({"error": "Compiler Error"})
    
    os.remove("temp/source.cpp")
    os.remove("temp/source.ll") 
    res = parse_vtables(vtable_out.decode('utf-8'))


    return json.dumps(res)