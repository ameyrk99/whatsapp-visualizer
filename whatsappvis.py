import func, times, draw
import argparse

def main():

    # Get files, override option and word length from arguments
    parser = argparse.ArgumentParser(description="Whatsapp Chat Visualizer")
    parser.add_argument("-f", "--file", help="Chat file", required=True)
    parser.add_argument("-l", "--wordLength", help="Minimum length of words for data vis [default=4]", required=False)
    parser.add_argument("-p", "--pie", help="Make the program draw pie-chart[y/n]", required=False)

    args = vars(parser.parse_args())


    file = args["file"]
    mostwords = args["wordLength"]
    pie = args["pie"]

    if mostwords is None:
        mostwords = 4
    else:
        mostwords = int(mostwords)

    if pie is None:
        pie = 'n'

    # Get a list with new lines fixed
    clean_lines = func.fixnl(file)

    # Remove dates from the list we got
    lines = func.rmdates(file)

    # Get users from the list of messages
    usrs = func.getusers(lines)

    # Get the list of most words, messages, media, and list of words from the messages
    data = func.data(usrs, lines)

    # Get a list of most used words (with word length above something [default=4])
    topusedwords = func.topwords(data[3], mostwords)

    #Graph all the data we collected
    draw.vis(usrs, data, topusedwords, file, pie, clean_lines, mostwords)

    # Print out a csv
    func.printcsv(usrs, data)


if __name__ == "__main__":
    main()