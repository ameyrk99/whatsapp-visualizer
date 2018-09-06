def get_times(lst):
    """Get time from messages and returns list of distribution of messages"""

    lstoftimings = []
    hours = [0, 0, 0, 0]
    test = 0

    for i in lst:
        try:
            temp = i.split(" - ")[0]
            temp = temp.split(", ")[1]
            lstoftimings.append(temp)
        except:
            test += 1

    for i in lstoftimings:
        try:
            try:
                temp = i.split(" ")
                hour, m = int(temp[0].split(":")[0]), temp[1]

                if m == "PM":
                    if hour > 0 and hour <= 4:
                        hours[1] += 1
                    elif hour > 4 and hour <= 7:
                        hours[2] += 1
                    elif hour > 7 and hour <= 12:
                        hours[3] += 1
                elif m == "AM":
                    if hour > 0 and hour <= 5:
                        hours[3] += 1
                    elif hour > 5 and hour <= 12:
                        hours[0] += 1
            except:
                hour = int(i.split(":")[0])

                if hour > 5 and hour <= 12:
                    hours[0] += 1
                elif hour > 12 and hour <= 16:
                    hours[1] += 1
                elif hour > 16 and hour <= 19:
                    hours[2] += 1
                else:
                    hours[3] += 1
        except:
            test += 1

    return hours

