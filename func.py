def rmdates(filename):
    """Remove dates from file"""
    data = open(filename, "r")
    # res = open("rmddates.txt", "w")

    lines = data.read().split("\n")
    lines = fixnl(lines)

    # print("\n".join(lines), file=res)

    temp = []
    for i in lines:
        try:
            temp += i.split("-")[1:]
        except:
            print("Error: ln[{}]".format(lines.index(i)))

    return temp

def fixnl(lst):
    """Fix lines: lines with newlines"""
    while True:
        for i in range(1, len(lst)-2):
            if lst[i] == "":
                lst[i-1] += " " + lst[i+1]
                lst = lst[:i]+lst[i+2:]
                check = 0
                break
            elif not (lst[i][0].isnumeric() and lst[i][1] == "/"):
                lst[i-1] += lst[i]
                lst = lst[:i]+lst[i+1:]
                check = 0
                break
            check = 1
        if check == 1:
            break

    return lst


def getusers(lines):
    usrs = []
    for i in lines:
        if ":" in i:
            usr = i.split(":")[:1]
            #print(usr)
            if usr not in usrs:
                usrs.append(usr)

    
    temp = []
    for i in usrs:
        temp += i   

    return temp

def numberOfMsgs(users, lines):
    emp = [0] * len(users)

    for i in lines:
        if ":" in i:
            usr = i.split(":")[:1]
            emp[users.index(usr[0])] += 1
    
    return emp

def words(users, lines):
    emp = [0] * len(users)

    for i in lines:
        if ":" in i:
            spl = i.split(":")
            usr = spl[:1]
            msg = "".join(spl[1:])

            emp[users.index(usr[0])] += len(msg.split(" "))
    
    return emp