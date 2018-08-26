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

# 1. Find the entry.
# Give me all the burgers from the table menue_item where name like '%Veggie Burger'
veggieBurgers = session.query(MenuItem).filter_by(name='Veggie Burger')
for veggieBurger in veggieBurgers:
    if veggieBurger.restaurant.name == "Urban Burger":
        print("Found the right burger")
        # Assign the veggieburger recordset which matches the condition to a variable
        UrbanVeggieBurger = veggieBurger
        # Break the for loop after finding the first instance being right
        break
    else:
        print("Not the right burger")
        continue

# 2. Delete from the session
session.delete(UrbanVeggieBurger)

# 4. Commit the session
session.commit()
