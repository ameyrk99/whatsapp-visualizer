from matplotlib import pyplot
from times import get_times

def vis(usrs, data, topw, filename, owr, lst, mostUsedLength):
    """Visualize data gathered"""

    msgs = data[0]
    wrds = data[1]
    media = data[2]

    colors = ['#FF7F7F', '#7FBF7F', '#7F7FFF']

    if len(usrs) <= 4 or (owr.lower() == "y"):
        # If there are less than 4 users or they wanted pie graph
        # Because if there are too many users, they graph looks really ugly the other way

        # Pie Chart
        ax1 = pyplot.axes([0.6, 0.37, 0.4, 0.53])
        explode = [0.0155]*(len(usrs))
        ax1.pie(msgs, explode=explode, labels=usrs, colors=colors,
            autopct='%1.1f%%', pctdistance=0.89, shadow=False, startangle=140)

        centre_circle = pyplot.Circle((0,0), 0.8, fc="white")
        fig = pyplot.gcf()
        fig.gca().add_artist(centre_circle)
        ax1.axis('equal')
        pyplot.title("Messages")


        # Vertical bar graph for number of words used
        ax3 = pyplot.axes([0.45, 0.1, 0.21, 0.2])
        ax3.bar(usrs, wrds, color=colors)
        pyplot.title("Words")

    else:
        # If there are more than 4 users and they did not want pie

        # Horizontal bar graph for number of messages used
        ax1 = pyplot.axes([0.68, 0.37, 0.28, 0.53])
        ax1.barh(usrs, msgs, color=colors)
        pyplot.title("Messages")

        # Horizontal bar graph for number of words used
        ax3 = pyplot.axes([0.45, 0.1, 0.21, 0.2])
        ax3.barh(usrs, wrds, color=colors)
        pyplot.title("Words")
    
    # Horizontal bar graph for number of messages used
    ax2 = pyplot.axes([0.45, 0.37, 0.15, 0.53])
    ax2.barh(usrs, media, color=colors)
    pyplot.title("Media")

    words = []
    count = []
    for i in topw:
        words.append(i[1])
        count.append(i[0])

    # Horizontal bar graph for most words used
    ax4 = pyplot.axes([0.075, 0.1, 0.3, 0.8])
    ax4.barh(words, count, color=['orange', 'pink'], alpha=0.6)
    pyplot.title("Most Used Words (>= {})".format(mostUsedLength))


    # Vertical bar graph for number of messages per timings the day
    ax5 = pyplot.axes([0.72, 0.1, 0.22, 0.2])
    times = ['Morning', 'Afternoon', 'Evening', 'Night']
    timeData = get_times(lst)
    ax5.bar(times, timeData, color=['orange', 'red', 'blue', 'black'], alpha=0.5)
    pyplot.title("Timings")

    pyplot.show()

def graph_times(lst):
    """Separate graph of timings data"""

    times = ['Morning', 'Afternoon', 'Evening', 'Night']
    data = get_times(lst)

    pyplot.bar(times, data, color=['orange', 'red', 'blue', 'black'], alpha=0.5)

    pyplot.show()