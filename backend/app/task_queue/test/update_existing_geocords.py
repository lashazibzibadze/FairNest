from app.task_queue.tasks.update_listings import update_existing_geocords, add

print("Running task to update existing geocords in queue update_listings")
result = update_existing_geocords.apply_async(queue='update_listings')
# result = add.delay(4, 4)
print(result.ready())

# print("Running task to add 4 and 4 in queue update_listings")
# result = add.apply_async((4, 4), queue='update_listings')
# print(result.ready())