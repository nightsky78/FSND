import turtle

def move_white(some_turtle,x,y):
    some_turtle.color("white")
    some_turtle.setpos(x,y)
    some_turtle.color("black")

def write_initial():
    window = turtle.Screen()
    window.bgcolor("white")

    pen = turtle.Turtle()
    pen.forward(100)
    pen.right(90)
    pen.forward(200)
    move_white(pen, 0,-200)
    pen.circle(50,180)

    move_white(pen,200,0)
    pen.setheading(270)
    pen.forward(200)
    pen.backward(100)
    pen.setheading(0)
    pen.forward(100)
    pen.setheading(270)
    pen.forward(100)
    pen.backward(200)

    window.exitonclick()
        
write_initial()
