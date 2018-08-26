from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import psycopg2
# import the tables from my database class
from database_setup import Base, Restaurant, MenuItem

engine = create_engine('postgresql+psycopg2://vagrant:vagrant@192.168.56.3:5432/menu')

# Bind the class to the physical database
Base.metadata.bind = engine

# Create session to connect to the database.
# Interface sessin
DBSession = sessionmaker(bind=engine)

session = DBSession()

# example code for creating new dataset in the DB table
# newEntry = ClassName(property='value',... )
# session.add(newEntry)
# session.commit()
# now create a new database entry for the Restaurant
newRestaurant = Restaurant(name='Tabea Pizza Place')
session.add(newRestaurant)

# same entry created for the menuitem
newMenuItem = MenuItem(name='Chicken', course='Entree', description='400 g sirloinnsteak',
                       price='$ 8.99', restaurant=newRestaurant)
session.add(newMenuItem)
session.commit()

# now read the information from the database
items = session.query(MenuItem).all()
print(items)
for item in items:
    print(item.name)


