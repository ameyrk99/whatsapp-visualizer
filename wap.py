import func

lines = func.rmdates("chat.txt")
usrs = func.getusers(lines)

number = func.numberOfMsgs(usrs, lines)
numberofwords = func.words(usrs, lines)

for i in range(len(usrs)):
    print("{}: {} | {}".format(usrs[i], number[i], numberofwords[i]))