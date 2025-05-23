# FairNest FastAPI Backend

## How to set up the backend locally

### 1. Create a Virtual Environment

Run the following commands

```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment

-   **Mac/Linux**:
    ```bash
    source venv/bin/activate
    ```
-   **Windows**:
    ```bash
    venv\Scripts\activate
    ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create an .env file in /backend/app and copy the secrets from discord

### 5. Start up the FastAPI server

```bash
cd backend
uvicorn app.main:app --reload
```


## Celery(Distributed Task Queue) Documentation
> [!IMPORTANT]  
> Always update your dependencies by installing from the latest ```requirements.txt``` file to ensure compatibility and stability. Use ```pip install -r requirements.txt``` to install the specified versions.

### Setting up the broker
1. Install [docker](http://docker.com/) if you don't have it already.
2. Pull and run the docker image for RabbitMQ
```bash
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:management
```

You can access RabbitMQ's management UI at http://localhost:15672/ (default user/pass: guest/guest).

### Running Celery
> [!Note]  
> Make sure you are in the backend directory and not backend/app

**Start the Celery Worker:**
```bash
celery -A worker.worker worker --loglevel=info -Q update_listings
```

### Manually sending a task to the queue
This is for updating existing addresses with geocords
```bash
PYTHONPATH=$(pwd) python3 -m app.task_queue.test.update_existing_geocords
```

## Database Documentation
> [!IMPORTANT]  
> Always update your dependencies by installing from the latest ```requirements.txt``` file to ensure compatibility and stability. Use ```pip install -r requirements.txt``` to install the specified versions.
### Naming Conventions
1. Table names: Use plural nouns in lowercase (e.g., users, listings).
2. Column names: Use snake_case (e.g., first_name, address_id, created_at).
3. Enums: Enum values should be capitalized (e.g., ACTIVE, INACTIVE).

### Modifying the Database Schema
Please use migrations when modifying the database schema!

We are using Alembic for migrations

#### Steps to modify the database schema
1. Modify the python models directly in backend/app/models.py

> [!Note]  
> Make sure you are in the backend directory and not backend/app

2. Generate a new migration script using the following command
```bash
alembic revision --autogenerate -m "Description of changes"
```
3. Apply the migration script
```bash
alembic upgrade head
```
4. If possible, please update the pydantic schemas in backend/app/schemas to reflect the changes as well

#### Rollback a migration
If you haven't applied the migration script yet, look in backend/app/alembic/versions. Click in each version until you find the migration script with the same message in the head and delete it. Then you can regenerate the migration script after modifications.

If you applied the migration script, run the following command.
```bash
alembic downgrade -1
```
Then follow the same steps as above to delete the migration script.
## API Documentation

FastAPI automatically generates interactive API docs:

-   Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
-   ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Example API Endpoint: Get Listings

This is an example listing, read the docs to get all the api endpoints and more information

### Endpoint

```http
GET /listings?skip={skip}&limit={limit}&country={country}&postal_code={postal_code}&street={street}&administrative_area={administrative_area}&locality={locality}
```

### Query Parameters

-   `skip` (integer, optional, default: `0`): Number of records to skip
-   `limit` (integer, optional, default: `10`): Maximum number of records to return
-   `country` (string, optional): Filter by country
-   `postal_code` (string, optional): Filter by postal code
-   `street` (string, optional): Filter by street name
-   `administrative_area` (string, optional): Filter by administrative area
-   `locality` (string, optional): Filter by locality

### Example Response

```json
[
    {
        "price": 150000000,
        "bedrooms": 8,
        "bathrooms": 10,
        "square_feet": 11535,
        "sale_status": "Condo for sale",
        "acre_lot": null,
        "tour_available": true,
        "image_source": "https://ap.rdcpix.com/328ae7c6cda20ff8ec0424e0965a5a5fl-m1813169937rd-w960_h720.jpg",
        "id": 2,
        "date_posted": "2025-03-04T17:53:14.861913",
        "address": {
            "country": "US",
            "administrative_area": "NY",
            "sub_administrative_area": null,
            "locality": "Manhattan",
            "postal_code": "10019",
            "street": "W 57th St",
            "premise": "217",
            "sub_premise": "127/128",
            "id": 2
        }
    }
]
```

## Using TanStack Query to Fetch Listings
> [!IMPORTANT]  
> Always update your dependencies by installing from the latest ```requirements.txt``` file to ensure compatibility and stability. Use ```pip install -r requirements.txt``` to install the specified versions.

### Install TanStack Query

```bash
npm install @tanstack/react-query
```

### Define TypeScript Types

Since FastAPI does not automatically generate TypeScript types, define them manually/generate the types using chatGPT:

These are the types for Address and Listing so far
```ts
interface Address {
    id: number;
    country: string;
    administrative_area: string;
    sub_administrative_area?: string | null;
    locality: string;
    postal_code: string;
    street: string;
    premise?: string | null;
    sub_premise?: string | null;
}

interface Listing {
    id: number;
    price: number;
    bedrooms?: number | null;
    bathrooms?: number | null;
    square_feet?: number | null;
    sale_status: string;
    acre_lot?: number | null;
    tour_available: boolean;
    image_source?: string | null;
    date_posted?: string | null;
    address: AddressResponse;
}
```

### Implement Query Hook

```ts
import { useQuery } from "@tanstack/react-query";

const fetchListings = async (
    skip = 0,
    limit = 10,
    country?: string,
    postal_code?: string,
    street?: string,
    administrative_area?: string,
    locality?: string
): Promise<Listing[]> => {
    const queryParams = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        ...(country && { country }),
        ...(postal_code && { postal_code }),
        ...(street && { street }),
        ...(administrative_area && { administrative_area }),
        ...(locality && { locality }),
    }).toString();

    const response = await fetch(
        `http://127.0.0.1:8000/listings?${queryParams}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch listings");
    }
    return response.json();
};


// Best practice is to create a custom hook to fetch the data
export function useListings(
    skip = 0,
    limit = 10,
    country?: string,
    postal_code?: string,
    street?: string,
    administrative_area?: string,
    locality?: string
) {
    return useQuery({
        queryKey: [
            "listings",
            skip,
            limit,
            country,
            postal_code,
            street,
            administrative_area,
            locality,
        ],
        queryFn: () =>
            fetchListings(
                skip,
                limit,
                country,
                postal_code,
                street,
                administrative_area,
                locality
            ),
    });
}
```

### Example Component

```tsx
import React from "react";
import { useListings } from "./useListings";

const Listings: React.FC = () => {
    const { data, error, isLoading } = useListings(
        0,
        10,
        "US",
        "10019"
    );

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading listings</p>;

    return (
        <ul>
            {data?.map((listing) => (
                <li key={listing.id}>
                    {listing.title} - ${listing.price} ({listing.location})
                </li>
            ))}
        </ul>
    );
};

export default Listings;
```

Now, you can use the `<Listings />` component in your React application to display real estate listings fetched from your FastAPI backend with filters.

