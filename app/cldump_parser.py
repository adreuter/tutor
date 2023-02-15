import re
import json

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
                    res[name].append({"kind": "method", "val": val})
            elif(is_vptr):
                res[name].append({"kind": "vptr", "val": is_vptr.groups()[1]})
    return res


def parse_records(input):
    ast = json.loads(input)
    records = {}
    for child in ast["inner"]:
        if(child["kind"] == "CXXRecordDecl"):
            record_name = child["name"]
            records[record_name] = {"hasVptr": True, "bases": {}, "members": {}, "virtual-bases": {}}
            if "bases" in child:
                for base in child["bases"]:
                    base_name = base["type"]["qualType"]
                    base_rec = records[base_name].copy()
                    for virt_base in records[base_name]["virtual-bases"]:
                        records[record_name]["virtual-bases"][virt_base] = records[virt_base]
                    base_rec["virtual-bases"] = {}
                    if "isVirtual" in base:
                        records[record_name]["virtual-bases"][base_name] = base_rec
                    else:
                        records[record_name]["hasVptr"] = False
                        records[record_name]["bases"][base_name] = base_rec
            for member in child["inner"]:
                if(member["kind"] == "FieldDecl"):
                    records[record_name]["members"][member["name"]] = member["type"]["qualType"]
    return records
