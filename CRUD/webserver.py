from http.server import BaseHTTPRequestHandler, HTTPServer
import cgi # common gateway interface
from urllib.parse import parse_qs
# Import all the database stuff
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# import the tables from my database class
from database_setup import Base, Restaurant, MenuItem

# Code will have two main methods
# 1. handler (contains the code based on http request sent to the server)
# 2. Main (Create Server and specify port)

# create the connection to the databas
engine = create_engine('postgresql+psycopg2://vagrant:vagrant@192.168.56.3:5432/menu')

# Bind the class to the physical database
Base.metadata.bind = engine

# Create session to connect to the database.
# Interface sessin
DBSession = sessionmaker(bind=engine)

session = DBSession()

# define the WebserverHandler which is calle in the HTTP Server (extend
# from class BaseHTTPRequestHandler
class WebserverHandler(BaseHTTPRequestHandler):
    # The do get function handles all the request the web server receives.
    # it needs to have that name to overwrite the function in the superclass.
    def do_GET(self):
        # if requested URL ends with hello
        try:
            # send header
            print(self.path)
            print(self.path.endswith("new"))

            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            if self.path.endswith("/hello"):
                # send header

                output = ""
                output += "<html><body>"
                output += "<h1>Hello!</h1>"
                output += '''<form method='POST' action='/hello'><h2>What would you like me to say?</h2>
                        <input name="message" type="text" ><input type="submit" value="Submit"> </form>'''
                output += "</body></html>"

                # send output back to the client
                self.wfile.write(output.encode())
                print(output)
                return
            # listen to another path and show different site
            if self.path.endswith("/hola"):
                output = ""
                output += "<html><body>Holla!" \
                          "<a href = '/hello'> Back to hello</a>"
                output += "<form method='POST' action='/hello'>" \
                                  "<h2>What would you like me to say?</h2><input name='message' type='text'>" \
                                  "<input type='submit' value='Submit'> </form>"
                output += "</body><html>"

                # send output back to the client
                self.wfile.write(output.encode())
                return

            if self.path.endswith("/restaurants"):
                # get list of restaurants out of the database
                print("show restaurants")
                myrestaurants = session.query(Restaurant).all()
                print("This is myrestaurants:{0}".format(myrestaurants))
                output = ""
                output += "<html><body>"
                for item in myrestaurants:
                    output += "{0} <br>".format(item.name)
                    output += '<a href="./restaurants/{0}/edit">Edit</a> <br>'.format(item.id)
                    output += '<a href="./restaurants/{0}/delete">Delete</a>'.format(item.id)
                    output += '<br><br>'
                self.wfile.write(output.encode())
                return

            if self.path.endswith("new"):
                # get list of restaurants out of the database
                print("adding a new restaurant")
                output = ""
                output += "<html><body>"
                output += "<form method = 'POST'>"
                output += "<label>Restaurant name" \
                          "<input name='name'>" \
                          "</label>" \
                          "<br>" \
                          "<button type='submit'>Submit</button>"
                output += "</form>"
                output += "</body></html>"
                self.wfile.write(output.encode())
                return

            if self.path.endswith("edit"):
                # get list of restaurants out of the database
                print("Edit the restaurant name")
                output = ""
                output += "<html><body>"
                output += "<form method = 'POST'>"
                output += "<label>Change Restaurant name" \
                          "<input name='newname'>" \
                          "</label>" \
                          "<br>" \
                          "<button type='submit' value='delete'>Submit</button>"
                output += "</form>"
                output += "</body></html>"
                self.wfile.write(output.encode())
                return

            if self.path.endswith("delete"):
                print("Delete the restaurant ")
                output = ""
                output += "<html><body>" \
                          "Do your really want to delete?"
                output += "<form method = 'POST'>"
                output += "<button type='submit'>Submit</button>"
                output += "</form>"
                output += "</body></html>"
                self.wfile.write(output.encode())
                return

        except IOError:
            self.send_error(404, "File Not Found {0}".format(self.path))

    def do_POST(self):
        try:
            # Parse the header
            length = int(self.headers.get('Content-length', 0))
            body = self.rfile.read(length).decode()
            print(body)
            params = parse_qs(body)

            if self.path.endswith("/restaurants/new"):

                rests = session.query(Restaurant).all()
                print("This is the restaurant request{0}".format(rests))
                for rest in rests:
                    print(rest.name)

                NewRestaurant= Restaurant(name='{0}'.format(params["name"][0]))
                print("Adding the restaurant:{0}".format(Restaurant.name))
                session.add(NewRestaurant)
                session.commit()
                print("now adding the restaurant")

                # Go back to the main page and list the restaurants
                self.send_response(303)
                self.send_header('Location', '/restaurants')
                self.end_headers()

            if self.path.endswith("edit"):

                # get the ID from the endpath by using the path split command (very simple;-))
                EditRestaurant = session.query(Restaurant).filter_by(id=self.path.split("/")[2])

                EditRestaurant[0].name=params["newname"][0]
                print("editing the restaurant ID: {0} with name {1}".format(EditRestaurant[0].id, EditRestaurant[0].name))
                session.add(EditRestaurant[0])
                session.commit()
                print("now editing the restaurant")

                # Go back to the main page and list the restaurants
                self.send_response(303)
                self.send_header('Location', '/restaurants')
                self.end_headers()

            if self.path.endswith("delete"):
                # get to be deleted of restaurants out of the database
                DeleteRestaurants = session.query(Restaurant).filter_by(id=self.path.split("/")[2]).one()
                print("deleting the restaurant ID: {0} with name {1}".format(DeleteRestaurants.id, DeleteRestaurants.name))

                # Delete only works if no contraint is violated. Other wise the delete commande could just hang
                session.delete(DeleteRestaurants)
                session.commit()
                print("now deleted")

                self.send_response(303)
                self.send_header('Location', '/restaurants')
                self.end_headers()


            if self.path.endswith("/hola") or self.path.endswith("/hola"):
                # send the response code that indicates a successful post
                self.send_response(301)
                print('send response')
                self.end_headers()
                print('end header')

                messagecontent = params["message"][0]
                print("This is my message content {0}".format(messagecontent))
                # Message is sent via as part of the post response. Couldnt I sent a redirect as well?
                print("Start output")
                output = ""
                output += "<html><body>"
                output += " <h2>Enter the greeting: </h2>"
                output += "<h1> {0} </h1>".format(messagecontent)

                output += "<form method='POST' action='/hello'>" \
                              "<h2>What would you like me to say?</h2><input name='message' type='text'>" \
                              "<input type='submit' value='Submit'> </form>"
                output += "</body></html>"
                print("This is output" + output)
                self.wfile.write(output.encode())

        except:
            pass

def main():
    try:
        # Specify the port in a seperate variable
        port = 8080
        # create server instance of the HTTPServer class (see import)
        # webserverHandler is the Handlerclass which defines how to handle request
        server = HTTPServer(('', port), WebserverHandler)
        print("Webserver is running on port: {0}".format(port))
        server.serve_forever()

    # Is executed when the user holds Crtl C on the key board.
    except KeyboardInterrupt:
        print("^C entered, stopping web server ...")
        # stop webserver with socket close function.
        server.socket.close()


# Block of code at the end of the file to immidiateley run the main method when
# the python intepreter executes the script.
if __name__ == '__main__':
    main()
