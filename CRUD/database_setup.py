# CONFIGURATION
# Do all imports required for sqlalchemy
import sys

import psycopg2

from sqlalchemy import Column, ForeignKey, Integer, String

from sqlalchemy.ext.declarative import declarative_base

# seems to have something to do with the relationships in the table
from sqlalchemy.orm import relationship

from sqlalchemy import create_engine

# Let SQLalchemy know that below classes are special  classes corresponding with tables in our database
Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    name = Column(String(200), nullable=False)
    email = Column(String(100), nullable=False)
    picture = Column(String(200), nullable=False)
    id = Column(Integer, primary_key=True)



# Define one class for each table
# Restaurant is the first table
class Restaurant(Base):
    # define the table name with the special variable __table name
    __tablename__ = 'restaurant'

    #  MAPPER
    # define two columns in the table, where
    # 1. the type is string(80) and can not be null
    # 2. the type is an integer and is a primary key
    name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)  # looks like it make a join
    # relationship with class User
    user = relationship(User)



# Define MenuItem as the second table
class MenuItem(Base):
    # again as before set table name for this table.
    __tablename__ = 'menue_item'

    # MAPPER
    # define 5 columns in the table, where:
    # 1. name as in table Restaurant
    # 2. id as in table restaurant
    # 3. course with Sting and 250 characters length
    # 4. price with Sting and 8 characters length
    # 5. reference to the restaurant with an ID
    name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    course = Column(String(250))
    description = Column(String(2500))
    price = Column(String())
    restaurant_id = Column(Integer, ForeignKey('restaurant.id'))  # looks like it make a join
    # relationship with class Restaurant
    restaurant = relationship(Restaurant)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)  # looks like it make a join
    # relationship with class User
    user = relationship(User)

    # adding serialisation for enabling JSON interface
    @property
    def serialize(self):
        # Returns object data in easily serializable format
        return {
            'name': self.name,
            'description': self.description,
            'id': self.id,
            'price': self.price,
            'course': self.course,
        }




# Create instance of the create_engine class and point it to the connection to our database.
# The database needs to exist already
engine = create_engine('postgresql+psycopg2://vagrant:vagrant@192.168.56.3:5432/menu')

Base.metadata.create_all(engine)
