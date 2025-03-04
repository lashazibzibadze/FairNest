from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from config import username, password, host, port, dbname

engine = create_engine(f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{dbname}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()