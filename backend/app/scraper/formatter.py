import re
from pathlib import Path
import json
from datetime import datetime

import re

import re

def extract_address(full_address):
    """
    Extracts:
    - premise (e.g. "78-01")
    - sub_premise (e.g. "Apt 3B")
    - street (e.g. "86th St")
    - city (e.g. "Glendale")
    - state (e.g. "NY")
    - postal code (e.g. "11385")
    """

    # Split the full address
    address_parts = full_address.strip().split(", ")
    street_part = address_parts[0] if len(address_parts) > 0 else ""
    city = address_parts[1] if len(address_parts) > 1 else None
    state_zip = address_parts[2] if len(address_parts) > 2 else ""

    # Extract state and ZIP
    state = postal_code = None
    if state_zip:
        match = re.match(r"([A-Z]{2})\s+(\d{5})", state_zip)
        if match:
            state, postal_code = match.groups()

    # Extract premise like "123" or "78-01"
    premise_match = re.match(r"^(\d+(?:-\d+)?)(?:\s+|$)", street_part)

    # Extract sub-premise like Apt/Unit/Floor/Suite
    sub_premise_match = re.search(r"(?:Apt|Unit|Floor|Suite|#)\s*([\w\d/-]+)", street_part, re.IGNORECASE)

    premise = premise_match.group(1) if premise_match else None
    sub_premise = sub_premise_match.group(1) if sub_premise_match else None

    # Clean the street name
    street_clean = street_part
    if premise:
        street_clean = re.sub(rf"^{re.escape(premise)}\s*", "", street_clean)
    if sub_premise:
        street_clean = re.sub(r"(?:Apt|Unit|Floor|Suite|#)\s*[\w\d/-]+", "", street_clean, flags=re.IGNORECASE)

    street_clean = street_clean.strip()

    return premise, sub_premise, street_clean, city, state, postal_code




def safe_int(value):
    # Convert cleaned numeric string to int, returning None if invalid
    if value and value.isdigit():
        return int(value)
    return None

def safe_float(value):
    # Convert cleaned numeric string to float, returning None if invalid
    try:
        return float(value) if value else None
    except ValueError:
        return None

# print(extract_premise_and_sub_premise("3308 210th St, Bayside, NY 11361"))
# print(extract_premise_and_sub_premise("301 E 69th St Apt 15K, New York, NY 10021"))
# print(extract_premise_and_sub_premise("646-662 Port Richmond Ave, Staten Island, NY 10302"))

