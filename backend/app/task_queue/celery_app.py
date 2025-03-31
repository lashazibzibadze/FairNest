from celery import Celery
from app.config import username, password, host, port, dbname 

app = Celery(
    "update_listings",
    broker="pyamqp://guest:guest@localhost//",
    backend=f"db+postgresql://{username}:{password}@{host}:{port}/{dbname}"
)
app.conf.task_routes = {'update_listings.tasks.*': {'queue': 'update_listings'}}
app.conf.task_track_started = True
app.conf.imports = (
    "app.task_queue.tasks",
)