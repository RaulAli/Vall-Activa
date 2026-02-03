import sqlalchemy as sa
import enum

from datetime import datetime
from uuid import uuid4, UUID
from sqlalchemy import String, Boolean, DateTime, Text, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as DB_UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from datetime import date as date_type

class Base(DeclarativeBase):
    pass

class TaskModel(Base):
    __tablename__ = "tasks"

    id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), primary_key=True, default=uuid4)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    done: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

class RouteModel(Base):
    __tablename__ = "routes"

    id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), primary_key=True, default=uuid4)

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[date_type] = mapped_column(sa.Date(), nullable=False)
    distance_km: Mapped[float] = mapped_column(sa.Float(), nullable=False)
    elevation_gain_m: Mapped[int] = mapped_column(sa.Integer(), nullable=False)
    total_time_min: Mapped[int] = mapped_column(sa.Integer(), nullable=False)
    difficulty: Mapped[int] = mapped_column(sa.Integer(), nullable=False)
    region: Mapped[str] = mapped_column(String(200), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    start_lat: Mapped[float | None] = mapped_column(sa.Float(), nullable=True)
    start_lng: Mapped[float | None] = mapped_column(sa.Float(), nullable=True)

    end_lat: Mapped[float | None] = mapped_column(sa.Float(), nullable=True)
    end_lng: Mapped[float | None] = mapped_column(sa.Float(), nullable=True)

    is_circular: Mapped[bool] = mapped_column(sa.Boolean(), nullable=False, default=False)

    gpx_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    gpx_content: Mapped[str | None] = mapped_column(Text, nullable=True)

    track_geojson: Mapped[dict | None] = mapped_column(sa.JSON(), nullable=True)

    elevation_loss_m: Mapped[int | None] = mapped_column(sa.Integer(), nullable=True)
    min_altitude_m: Mapped[int | None] = mapped_column(sa.Integer(), nullable=True)
    max_altitude_m: Mapped[int | None] = mapped_column(sa.Integer(), nullable=True)
    
    vac_points: Mapped[int] = mapped_column(sa.Integer(), nullable=False, default=0)
 
    user_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    user = relationship("UserModel")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

def touch_updated_at(model) -> None:
    model.updated_at = datetime.utcnow()

class BusinessModel(Base):
    __tablename__ = "businesses"

    id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), primary_key=True, default=uuid4)

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    category: Mapped[str] = mapped_column(String(100), nullable=False)
    region: Mapped[str] = mapped_column(String(200), nullable=False)
    city: Mapped[str | None] = mapped_column(String(200), nullable=True)
    address: Mapped[str | None] = mapped_column(String(300), nullable=True)

    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    website: Mapped[str | None] = mapped_column(String(300), nullable=True)
    instagram: Mapped[str | None] = mapped_column(String(100), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
 
    owner_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    owner = relationship("UserModel")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    offers = relationship("OfferModel", back_populates="business", cascade="all, delete-orphan")

class OfferModel(Base):
    __tablename__ = "offers"

    id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), primary_key=True, default=uuid4)

    business_id: Mapped[UUID] = mapped_column(
        DB_UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    discount_type: Mapped[str] = mapped_column(String(30), nullable=False)
    discount_value: Mapped[str] = mapped_column(String(100), nullable=False)

    start_date: Mapped[date_type] = mapped_column(sa.Date(), nullable=False)
    end_date: Mapped[date_type] = mapped_column(sa.Date(), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    terms: Mapped[str | None] = mapped_column(Text, nullable=True)

    vac_price: Mapped[int] = mapped_column(sa.Integer(), nullable=False, default=500)
    stock_quantity: Mapped[int] = mapped_column(sa.Integer(), nullable=False, default=10)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    business = relationship("BusinessModel", back_populates="offers")

class TicketStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    USED = "USED"
    EXPIRED = "EXPIRED"

class TicketModel(Base):
    __tablename__ = "tickets"

    id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    offer_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("offers.id", ondelete="CASCADE"), nullable=False, index=True)
    
    validation_code: Mapped[str] = mapped_column(String(20), nullable=False, unique=True)
    status: Mapped[TicketStatus] = mapped_column(Enum(TicketStatus, name="ticket_status"), nullable=False, default=TicketStatus.ACTIVE)
    
    redeemed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    user = relationship("UserModel")
    offer = relationship("OfferModel")

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    ATHLETE = "ATHLETE"
    ATHLETE_VIP = "ATHLETE_VIP"
    BUSINESS = "BUSINESS"

class BusinessStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    athlete_profile = relationship("AthleteProfileModel", back_populates="user", uselist=False)
    business_profile = relationship("BusinessProfileModel", back_populates="user", uselist=False)
    admin_profile = relationship("AdminProfileModel", back_populates="user", uselist=False)


class AthleteProfileModel(Base):
    __tablename__ = "athlete_profiles"

    user_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    total_vac_points: Mapped[int] = mapped_column(sa.Integer(), nullable=False, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="athlete_profile")


class BusinessProfileModel(Base):
    __tablename__ = "business_profiles"

    user_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)

    status: Mapped[BusinessStatus] = mapped_column(Enum(BusinessStatus, name="business_status"), nullable=False, default=BusinessStatus.PENDING)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="business_profile")


class AdminProfileModel(Base):
    __tablename__ = "admin_profiles"

    user_id: Mapped[UUID] = mapped_column(DB_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="admin_profile")