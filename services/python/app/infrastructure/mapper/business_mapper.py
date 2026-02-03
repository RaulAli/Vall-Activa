from app.domain.entity.business import Business
from app.infrastructure.db.models import BusinessModel

def model_to_entity(m: BusinessModel) -> Business:
    return Business(
        id=m.id,
        owner_id=m.owner_id,
        name=m.name,
        description=m.description,
        category=m.category,
        region=m.region,
        city=m.city,
        phone=m.phone,
        website=m.website,
        instagram=m.instagram,
        address=getattr(m, "address", None),
        logo_url=m.logo_url,
        status=None, # Will be filled by repository with extra join
        created_at=m.created_at,
        updated_at=m.updated_at,
    )
