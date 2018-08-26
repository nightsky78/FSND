from urllib import urlopen

def read_text():
#    path = raw_input()
    quotes = open("C:\Users\johan\Desktop\Moviel_quotes.txt")
    str = quotes.read()
#    print(str)
    quotes.close()
    return str

def check_profanity(text_to_check):
    connection = urlopen("http://isithackday.com/arrpi.php?text=" + text_to_check)
    print(connection.read())
    connection.close()


new_text = read_text()

check_profanity(new_text)
    
