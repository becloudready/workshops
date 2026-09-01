from database import Base, engine

# Import every model so SQLAlchemy knows about every table.
from models.user import User
from models.account import Account
from models.transactions import Transaction
from models.transfers import Transfer


print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Done!")