import json

with open("data.csv", "r") as f:
    data = f.read()

lines = data.split("\n")
all_data = [d.split(";") for d in lines]
formated = {}

for l in all_data:
    formated[l[0]] = l[1].replace("`", "").replace("infinity", "-1")

with open("export.json", "w") as outfile:
    json.dump(formated, outfile)