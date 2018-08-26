from twilio.rest import Client

# Your Account SID from twilio.com/console
account_sid = "ACf6372ff947ec627fb5face5e46bc01bf"
# Your Auth Token from twilio.com/console
auth_token  = "003f408041c04d15b3a6d0246179ee92"

client = Client(account_sid, auth_token)

message = client.messages.create(
    to="+491792374721", 
    from_="+491792374721",
    body="Hello from Python")

print(message.sid)
