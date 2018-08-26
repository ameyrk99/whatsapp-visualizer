import func

file = "chat"
lines = func.rmdates(file+".txt")
usrs = func.getusers(lines)

data = func.data(usrs, lines)

topusedwords = func.topwords(data[3], 4)

func.vis(usrs, data, topusedwords, file)