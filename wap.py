import func

file = "chat_full"
lines = func.rmdates(file+".txt")
usrs = func.getusers(lines)

data = func.data(usrs, lines)

topwords = 4
topusedwords = func.topwords(data[3], topwords)

func.vis(usrs, data, topusedwords, file, 5, 4)