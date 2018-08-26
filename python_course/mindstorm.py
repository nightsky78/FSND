import turtle

def draw_square(some_turtle):
    i=1
    while i <= 4:
        some_turtle.forward(100)
        some_turtle.right(90)
        i = i + 1

def draw_circle(some_turtle):
    some_turtle.circle(100)

def draw_triangle(some_turtle):
    i=1
    while i <= 3:
        some_turtle.forward(100)
        some_turtle.right(120)
        i = i + 1

def draw_shapes():
    window = turtle.Screen()
    window.bgcolor("red")

    #brad = turtle.Turtle()
    #brad.shape("turtle")
    #brad.color("yellow")
    #brad.speed(1)
    #draw_square(brad)

    angie = turtle.Turtle()
    angie.shape("arrow")
    angie.color("blue")
    angie.speed(10)

    # 360 dergrees in 10 degrees steps means 36 loops
    num_square = 1
    max_square = 36
    
    while num_square <= max_square:
        draw_square(angie)
        angie.right(10)
        num_square = num_square + 1


    #fred = turtle.Turtle()
    #fred.color("green")
    #draw_triangle(fred)


    window.exitonclick()
   
draw_shapes()
