import webbrowser
import time

break_count = 1
Total_break = 3

while break_count <= Total_break:
    print("The now current time is:" + time.ctime())
    time.sleep(5)
    webbrowser.open("https://www.youtube.com/watch?v=PfrRJYC4z6I")
    break_count += 1
