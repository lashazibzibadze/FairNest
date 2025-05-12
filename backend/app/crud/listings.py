from sqlalchemy import func, and_, desc
from sqlalchemy.orm import Session
from app import models, schemas

def get_base_listing_query(db: Session):
    subq = (
        db.query(
            func.max(models.Listing.created_at).label("max_created_at"),
            models.Listing.address_id
        )
        .group_by(models.Listing.address_id)
        .subquery()
    )

    return (
        db.query(models.Listing)
          .join(models.Address)
          .join(subq, and_(
              models.Listing.created_at == subq.c.max_created_at,
              models.Listing.address_id == subq.c.address_id
          ))
    )

def apply_field_filters(query, filters: schemas.ListingFilter):
    mapping = {
        "country": models.Address.country,
        "postal_code": models.Address.postal_code,
        "street": models.Address.street,
        "administrative_area": models.Address.administrative_area,
        "locality": models.Address.locality,
        "sale_status": models.Listing.sale_status,
        "tour_available": models.Listing.tour_available,
    }
    for param, col in mapping.items():
        val = getattr(filters, param)
        if val is not None:
            query = query.filter(col == val)
    return query

def apply_range_filters(query, filters: schemas.ListingFilter):
    mapping = {
        "min_price": (models.Listing.price, ">="),
        "max_price": (models.Listing.price, "<="),
        "min_bedrooms": (models.Listing.bedrooms, ">="),
        "max_bedrooms": (models.Listing.bedrooms, "<="),
        "min_bathrooms": (models.Listing.bathrooms, ">="),
        "max_bathrooms": (models.Listing.bathrooms, "<="),
        "min_square_feet": (models.Listing.square_feet, ">="),
        "max_square_feet": (models.Listing.square_feet, "<="),
        "min_acre_lot": (models.Listing.acre_lot, ">="),
        "max_acre_lot": (models.Listing.acre_lot, "<="),
    }
    for param, (col, op) in mapping.items():
        val = getattr(filters, param)
        if val is None:
            continue
        if op == ">=":
            query = query.filter(col >= val)
        else:
            query = query.filter(col <= val)
    return query

def paginate(query, skip: int, limit: int):
    total = query.order_by(None).with_entities(func.count()).scalar() or 0
    items = query.order_by(desc(models.Listing.created_at))\
                 .offset(skip).limit(limit).all()

    return {
        "listings":      items,
        "total_records": total,
        "total_pages":   (total + limit - 1) // limit,
        "current_page":  skip // limit + 1,
        "page_size":     limit,
    }
