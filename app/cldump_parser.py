import re

vtable_header = r"(Vtable\sfor\s'(.*)'\s\((.*) entries\).\n)"
vtable_entry = r"(\s\s\s(.*)\s\|\s(.*))"
vptr_entry = r"(\s\s\s\s\s\s\s--\s\((.*),\s(.*)\)\svtable\saddress\s--)"
thunk_entry = r"(\s\s\s\s\s\s\s\[this\sadjustment:\s(.*)\snon-virtual\])"
rtti_entry = r"(.*)\sRTTI"
offset_entry = r"offset_to_top\s\((.*)\)"

def parse_vtables(input):
    res = {}
    vtables = re.findall(rf"{vtable_header}((({vtable_entry}|{vptr_entry}|{thunk_entry})\n)*)\n", input)
    for vtable in vtables:
        name = vtable[1]
        res[name] = []
        entries = vtable[3].split("\n")
        for entry in entries:
            is_entry = re.match(vtable_entry, entry)
            is_vptr = re.match(vptr_entry, entry)
            if(is_entry):
                val = is_entry.groups()[2]
                is_rtti = re.match(rtti_entry, val)
                is_offset = re.match(offset_entry, val)
                if(is_rtti):
                    res[name].append({"kind": "RTTI", "val": "RTTI"})
                elif(is_offset):
                    res[name].append({"kind": "offset", "val": is_offset.groups()[0]})
                else:
                    res[name].append({"kind": "entry", "val": val})
            elif(is_vptr):
                res[name].append({"kind": "vptr", "val": is_vptr.groups()[1]})
    return res

#vtable_out = subprocess.check_output(f"clang -cc1 -fdump-vtable-layouts -emit-llvm {sys.argv[1]}", shell=True)
#print(str(vtable_out,'ascii'))
#res = parse_vtables(str(vtable_out,'ascii'))
#print(json.dumps(res, indent = 4))

"""
res = re.findall(r"(\*\*\*\sDumping AST Record Layout\n((.*)\|(.*)\n)*\n)", record_out)
ast_record = res[0][0]

entries = re.findall(r"(.*)\|(.*)", ast_record)
className = re.match(r"\sclass\s(.*)", entries[0][1]).groups()[0]
entry = re.match(r"\s\s\s\((\w)* vtable pointer\)", entries[1][1]).groups()[0]


def parse_records(input):
    res = re.findall(r"(\*\*\*\sDumping AST Record Layout\n((.*)\|(.*)\n)*\n)", input)
    for record in res:
        record_str = record[0]
        entries = re.findall(r"(.*)\|(.*)", record_str)
        className = re.match(r"\sclass\s(.*)", entries.pop(0)[1]).groups()[0]
        print("Class: [" + className + "]")
        for entry in entries:
            entry_str = entry[1]
            print(entry_str)
"""