from datetime import date, timedelta
import random

today = date(2025, 6, 2)
last_month_start = date(today.year, today.month - 1, 1)
next_year_end = date(today.year + 1, today.month, 1)

event_updates = []

for event_id in range(1, 132):
    start = last_month_start + timedelta(days=random.randint(0, (today - last_month_start).days))
    end = start + timedelta(days=random.randint(1, (next_year_end - start).days))
    event_updates.append((event_id, start, end))

for event_id, start_date, end_date in event_updates:
    print(f"UPDATE event SET start_date = '{start_date}', end_date = '{end_date}' WHERE event_id = {event_id};")
