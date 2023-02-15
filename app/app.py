from flask import Flask, redirect, url_for, request
import json
import sys
import subprocess
import binascii
import os

from cldump_parser import parse_vtables, parse_records

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
        ast_json = subprocess.check_output(f"clang-15 -Xclang -ast-dump=json -fsyntax-only temp/source.cpp", shell=True)
        vtable_out = subprocess.check_output(f"clang-15 -cc1 -fdump-vtable-layouts -emit-llvm temp/source.cpp", shell=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as e:
        return json.dumps({"error": e.stdout.decode('utf-8')})
    
    os.remove("temp/source.cpp")
    os.remove("temp/source.ll") 
    res = {"vtables": parse_vtables(vtable_out.decode('utf-8')), "records": parse_records(ast_json)}


    return json.dumps(res)