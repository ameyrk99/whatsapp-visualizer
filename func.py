from matplotlib import pyplot
import numpy as np

def rmdates(filename):
    """Removes the dates from the list of lines and returns the new list"""
    lines = fixnl(filename)
    temp = []
    for i in lines:
        try:
            spl = i.split("-")[1:]
            tp = "-".join(spl)
            temp.append(tp)
        except:
            print("Error: ln[{}]".format(lines.index(i)))

    return temp

def fixnl(filename):
    """Returns list of messages with new lines fixed."""
    data = open(filename, "r")

    lst = data.read().split("\n")

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

    data.close()

    return lst


def getusers(lines):
    """Returns a list of users in the chat"""
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

def data(users, lines):
    """Returns the list of messages in chat"""
    msgs = [0] * len(users)
    wrds = [0] * len(users)
    media = [0] * len(users)
    words = []

    for i in lines:
        if ":" in i:
            spl = i.split(":")
            usr = spl[:1]
            msg = "".join(spl[1:])
            
            msgs[users.index(usr[0])] += 1

            if msg == " <Media omitted>":
                media[users.index(usr[0])] += 1
                continue

            if msg == " This message was deleted":
                continue

            wrds[users.index(usr[0])] += len(msg.split(" "))
            words += msg.split(" ")
    
    return [msgs, wrds, media, words]

def topwords(wrds, num):
    """Returns a list of most used words"""
    clean_wrds = []

    for i in wrds:
        word = removepunc(i.lower())
        if not wordpresent(word, clean_wrds) and word != "" and len(word) >= num:
            clean_wrds.append(word)

    enu = []
    for i in clean_wrds:
        if not check_res(enu, i):
            temp = []
            temp.append(clean_wrds.count(i))
            temp.append(i)
            enu.append(temp)

    enu.sort(reverse = True)
    enu = enu[:15]
    return enu

def wordpresent(lst, wrd):
    """Check if word is already present in the list"""
    for i in lst:
        if wrd == i:
            return True
    return False

def check_res(nestwrds, wrd):
    """Check if word is inside the list's element's list"""
    for i in nestwrds:
        if wrd in i:
            return True

    return False


def removepunc(strn):
    """Remove punctuation from messages"""
    emp = ""
    for i in strn:
        if i.isnumeric() or i.isalpha():
            emp += i
        
    return emp

# def printcsv(users, data):
#     """Prints out a csv for further use of data"""
#     fl = open("WhatsappStats.csv", "w")
#     print("User,Messages,Words,Media", file=fl)
#     for i in range(len(users)):
#         print("{},{},{},{}".format(users[i][1:], data[0][i], data[1][i], data[2][i]), file=fl)