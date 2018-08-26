from flask import Flask, render_template, request, redirect, url_for, jsonify, make_response, flash
# import the session from flask to create a login session
from flask import session as login_session
import random, string
from oauth2client.client import flow_from_clientsecrets, FlowExchangeError
import httplib2
import json
import requests
# Import all the database stuff
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# import the tables from my database class
from database_setup import Base, Restaurant, MenuItem, User

#Load my client ID for Google login, so I do not need to hard code it.
#It is coded in the login html though, so maybe we need to find another way.
CLIENT_ID = json.loads(open('client_secrets.json','r').read())['web']['client_id']

# create the connection to the databas
engine = create_engine('postgresql+psycopg2://vagrant:vagrant@192.168.56.3:5432/menu')

# Bind the class to the physical database
Base.metadata.bind = engine

# Create session to connect to the database.
# Interface sessin
DBSession = sessionmaker(bind=engine)

session = DBSession()

# Create instance of this class with the name of the running app as an argument
app = Flask(__name__)

@app.route('/gconnect', methods=['POST'])
def gconnect():
    # Validate state token
    if request.args.get('state') != login_session['state']:
        response = make_response(json.dumps('Invalid state parameter.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    # Obtain authorization code
    code = request.data

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps('Failed to upgrade the authorization code.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps("Token's user ID doesn't match given user ID."), 401)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps("Token's client ID does not match app's."), 401)
        print("Token's client ID does not match app's.")
        response.headers['Content-Type'] = 'application/json'
        return response

    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        response = make_response(json.dumps('Current user is already connected.'),
                                 200)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later use.
    login_session['access_token'] = credentials.access_token
    login_session['gplus_id'] = gplus_id

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    login_session['username'] = data['name']
    login_session['picture'] = data['picture']
    login_session['email'] = data['email']

    if not getUserID(login_session['email']):
        createUser(login_session)

    login_session['user_id'] = getUserID(login_session['email'])

    output = ''
    output += '<h1>Welcome, '
    output += login_session['username']
    output += '!</h1>'
    output += '<img src="'
    output += login_session['picture']
    output += ' " style = "width: 300px; height: 300px;border-radius: 150px;-webkit-border-radius: 150px;-moz-border-radius: 150px;"> '
    flash("you are now logged in as %s" % login_session['username'])
    print("done!")
    return output

@app.route('/gdisconnect')
def gdisconnect():
    access_token = login_session.get('access_token')
    if access_token is None:
        print('Access Token is None')
        response = make_response(json.dumps('Current user not connected.'), 401)
        response.headers['Content-Type'] = 'application/json'
        return response
    print('In gdisconnect access token is %s', access_token)
    print('User name is: ')
    print(login_session['username'])
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % login_session['access_token']
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]
    print('result is ')
    print(result)
    if result['status'] == '200':
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        response = make_response(json.dumps('Successfully disconnected.'), 200)
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        response = make_response(json.dumps('Failed to revoke token for given user.', 400))
        response.headers['Content-Type'] = 'application/json'
        return response


# Create anti-forgery state token
@app.route('/login')
def showLogin():
    # Create anti-forgery state token this
    # This state token will be generated here and passed to the login template
    # When the login template comes back with the session token, we need to check if its still
    # the same session token
    state = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(32))
    login_session['state'] = state
    return render_template('login.html', STATE=state)

# app main page
@app.route('/')
@app.route('/restaurants/')
@app.route('/restaurants')
def restraurants():
    restaurants = session.query(Restaurant).all()

    output = render_template('restaurant.html', restaurants=restaurants)

    return output


# This defines the path where the application is reachable. If the declarators are stacked on top of each other
# the / redirect to /restaurant and this executes the code in Restaurants menue
# thw URL can contain a variable which the again can be used in the code
@app.route('/')
@app.route('/restaurants/<int:restaurant_id>/')

# This method simply shows the Menueitems for a restaurant
def restaurantMenu(restaurant_id):
    # select the restautant with the ID from the URL
    restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
    # read the menu items from the database
    items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
    # now we pass the results to the template and store in output variable
    # Some code is executed in the template
    output = render_template('menu.html', restaurant=restaurant, items=items)

    return output

# Task 1: Create route for newMenuItem function here
# The declarator supports get and post
@app.route('/restaurants/<int:restaurant_id>/new', methods=['GET', 'POST'])
def newMenuItem(restaurant_id):
    # Check if the user is logged in.
    if 'username' not in login_session:
        return redirect('/login')

    # request is a flask module for handling post requests
    print('username:{0}:'.format(login_session['user_id']))
    if request.method == 'POST':
        newItem = MenuItem(name=request.form['menu_name'], restaurant_id=restaurant_id,
                           user_id=restaurant.user_id)
        session.add(newItem)
        session.commit()
        return redirect(url_for('restaurantMenu', restaurant_id=restaurant_id))
    else:
        output = render_template('newmenuitem.html', restaurant_id=restaurant_id)
        return output

# Task 2: Create route for editMenuItem function here


@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/edit', methods=['GET', 'POST'])
def editMenuItem(restaurant_id, menu_id):
    # Check if the user is logged in.
    if 'username' not in login_session:
        return redirect('/login')

    if request.method == 'POST':
        editmenu = session.query(MenuItem).filter_by(id=menu_id).first()
        editmenu.name = request.form['new_name']
        session.add(editmenu)
        session.commit()
        return redirect(url_for('restaurantMenu', restaurant_id=restaurant_id))
    else:
        menu = session.query(MenuItem).filter_by(id=menu_id).first()
        output = render_template('editmenuitem.html', restaurant_id=restaurant_id, menu=menu)
        return output

# Task 3: Create a route for deleteMenuItem function here

@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/delete')
def deleteMenuItem(restaurant_id, menu_id):
    # Check if the user is logged in.
    if 'username' not in login_session:
        return redirect('/login')

    return "page to delete a menu item. Task 3 complete!"

@app.route('/restaurants/<int:restaurant_id>/JSON')
def restaurantMenuJson(restaurant_id):
    menu = session.query(MenuItem).filter_by(restaurant_id=restaurant_id).all()
    return jsonify(MenuItem=[i.serialize for i in menu])


@app.route('/findrestaurant')
def findARestaurant():
    # Do not store API key in the code normally
    address = request.args.get('address')
    meal = request.args.get('meal')
    print('This is the address: {0}'.format(address))
    google_api_key='AIzaSyC7kI44PCjoRsw6LSEWJDU3PRtxwxE2ZAM'
    # relace paces in the address string
    address_clean = address.replace(' ', '+')
    print('This is the address_clean: {0}'.format(address_clean))
    # Now I build my URL
    urlgoogle = 'https://maps.googleapis.com/maps/api/geocode/json?key={0}&address={1}'.format(
        google_api_key, address_clean)
    # create the instance of my URL call
    h = httplib2.Http()
    response, content = h.request(urlgoogle, 'GET')
    print('This is the response: {0}'.format(response))
    print('This is the content: {0}'.format(content))
    geocoding_result = json.loads(content)
    print(geocoding_result)
    # Now I have to read the content of the JSON structure
    # The index is required as there are multiple results in the JSON response
    locationresult = '{0},{1}'.format(geocoding_result['results'][0]['geometry']['location']['lat'],
                                         geocoding_result['results'][0]['geometry']['location']['lng'])

    urlfs = 'https://api.foursquare.com/v2/venues/explore'
    params = dict(
        client_id='X1SUCODMCGPQI40HJ3RPNRXGVJTWPBTRDKKDJKD3PAOHW2VH',
        client_secret='DM324VPQYSTRISJ2VXR0YN4HIHEUOCGKB14FJW0HOPZZLQ2N',
        v='20180323',
        ll=locationresult,
        intent='browse',
        radius=2500,
        query=meal,
        limit=6
    )
    resp = requests.get(url=urlfs, params=params)
    data = json.loads(resp.text)

    print('This is the FS response: {0}'.format(data['response']['groups'][0]['items'][0]['venue']['name']))

    return data['response']['groups'][0]['items'][0]['venue']['name']


def getUserInfo(user_id):
    return session.query(User).filter_by(id=user_id).one()


def getUserID(email):
    try:
        user = session.query(User).filter_by(email=email).one()
        return user.id
    except:
        return None



def createUser(login_session):
    newUser = User(name=login_session['username'], email=login_session['email'], picture=login_session['picture'])
    session.add(newUser)
    session.commit()
    user = session.query(User).filter_by(email=login_session['email']).first()
    return user.id


if __name__ == '__main__':
    # The debug True statement ensures that the app is restarted in case there is a code change
#    app.debug = True
    app.secret_key = 'super_secret_key'
    app.run(host='0.0.0.0', port=5000)

