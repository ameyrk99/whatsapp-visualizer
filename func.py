from matplotlib import pyplot

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
            spl = i.split("-")[1:]
            tp = "-".join(spl)
            temp.append(tp)
        except:
            print("Error: ln[{}]".format(lines.index(i)))

    data.close()
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

            wrds[users.index(usr[0])] += len(msg.split(" "))
            words += msg.split(" ")
    
    return [msgs, wrds, media, words]

def topwords(wrds, num):
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
    for i in lst:
        if wrd == i:
            return True
    return False

def check_res(nestwrds, wrd):
    check = False
    for i in nestwrds:
        if wrd in i:
            check = True

    return check


def removepunc(strn):
    emp = ""
    for i in strn:
        if i.isnumeric() or i.isalpha():
            emp += i
        
    return emp

def vis(usrs, data, topw, filename):
    msgs = data[0]
    wrds = data[1]
    media = data[2]

    # fig = pyplot.figure()
    ax1 = pyplot.axes([0.7, 0.45, 0.27, 0.5])
    colors = ['#FF7F7F', '#7FBF7F', '#7F7FFF']
    explode = [0.1]
    explode += [0]*(len(usrs) - 1)
    ax1.pie(msgs, explode=explode, labels=usrs, colors=colors,
        autopct='%1.1f%%', shadow=False, startangle=140)
    pyplot.title("Messages")

    ax2 = pyplot.axes([0.45, 0.55, 0.20, 0.35])
    ax2.bar(usrs, media, color=colors)
    pyplot.title("Media")
    # pyplot.bar(usrs, media)

    ax3 = pyplot.axes([0.45, 0.1, 0.5, 0.3])
    ax3.bar(usrs, wrds, color=colors)
    pyplot.title("Words")

    words = []
    count = []
    for i in topw:
        words.append(i[1])
        count.append(i[0])

    ax4 = pyplot.axes([0.075, 0.1, 0.3, 0.8])
    ax4.barh(words, count, color=['orange', 'pink'], alpha=0.6)
    pyplot.title("Most Used Words")

    # ax4 = 

    # pyplot.subplot(1, 1, 1)
    # pyplot.bar(usrs, media)
    # pyplot.title("Messages")

    # pyplot.legend(["Words", "Messages", "Media"])

    # fig.savefig(filename+".png")
    pyplot.show()