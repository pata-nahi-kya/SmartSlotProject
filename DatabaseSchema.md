# SmartSlot Database Schema

My project follows:

```text id="r2z0ka"
relational database architecture
```

Database:

```text id="c8p1jm"
SQL Server
```

ORM:

```text id="n5v7qx"
Entity Framework Core
```

---

# COMPLETE DATABASE DESIGN

# TABLES

```text id="x9l2wp"
Users
Businesses
Offers
Slots
Bookings
```

---

# DATABASE RELATIONSHIP FLOW

```text id="m7q1vb"
Users
   ↓

Businesses
   ↓

Offers
   ↓

Slots
   ↓

Bookings
```

---

# 1. USERS TABLE

Purpose:

```text id="y3p8nd"
admin authentication
```

# Schema

```sql id="b0k7rw"
CREATE TABLE Users (
    Id UNIQUEIDENTIFIER PRIMARY KEY,

    FullName NVARCHAR(100) NOT NULL,

    Email NVARCHAR(150) NOT NULL UNIQUE,

    PasswordHash NVARCHAR(MAX) NOT NULL,

    Role INT NOT NULL,

    CreatedAt DATETIME2 NOT NULL
);
```

# Entity

```csharp id="e2x9lt"
public class User
{
    public Guid Id { get; set; }

    public string FullName { get; set; }

    public string Email { get; set; }

    public string PasswordHash { get; set; }

    public UserRole Role { get; set; }

    public DateTime CreatedAt { get; set; }
}
```

---

# 2. BUSINESSES TABLE

Purpose:

```text id="q8v5na"
store businesses
```

Examples:

* salon
* gym
* restaurant
* clinic

# Schema

```sql id="d4n6xq"
CREATE TABLE Businesses (
    Id UNIQUEIDENTIFIER PRIMARY KEY,

    Name NVARCHAR(200) NOT NULL,

    Description NVARCHAR(MAX),

    City NVARCHAR(100) NOT NULL,

    Address NVARCHAR(MAX),

    PhoneNumber NVARCHAR(20),

    BusinessType NVARCHAR(100),

    CreatedAt DATETIME2 NOT NULL
);
```

# Relationship

```text id="h1m7zr"
1 Business → Many Offers
```

# Entity

```csharp id="p5q8xd"
public class Business
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string City { get; set; }

    public string Address { get; set; }

    public string PhoneNumber { get; set; }

    public string BusinessType { get; set; }

    public DateTime CreatedAt { get; set; }

    public ICollection<Offer> Offers { get; set; }
}
```

---

# 3. OFFERS TABLE

Purpose:

```text id="u4k1yc"
booking packages/services
```

Examples:

* Hair Spa
* VIP Dinner
* Gym Session

# Schema

```sql id="w7r2pb"
CREATE TABLE Offers (
    Id UNIQUEIDENTIFIER PRIMARY KEY,

    BusinessId UNIQUEIDENTIFIER NOT NULL,

    Title NVARCHAR(200) NOT NULL,

    Description NVARCHAR(MAX),

    Price DECIMAL(18,2) NOT NULL,

    MaxBookingsPerSlot INT NOT NULL,

    StartDate DATETIME2 NOT NULL,

    EndDate DATETIME2 NOT NULL,

    Status INT NOT NULL,

    CreatedAt DATETIME2 NOT NULL,

    CONSTRAINT FK_Offers_Businesses
    FOREIGN KEY (BusinessId)
    REFERENCES Businesses(Id)
);
```

# Relationship

```text id="s0j8nm"
1 Offer → Many Slots
```

# Entity

```csharp id="t3q9vx"
public class Offer
{
    public Guid Id { get; set; }

    public Guid BusinessId { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public decimal Price { get; set; }

    public int MaxBookingsPerSlot { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public OfferStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public Business Business { get; set; }

    public ICollection<Slot> Slots { get; set; }
}
```

---

# 4. SLOTS TABLE

Purpose:

```text id="v9b2ld"
time slot management
```

# Schema

```sql id="j6n4yf"
CREATE TABLE Slots (
    Id UNIQUEIDENTIFIER PRIMARY KEY,

    OfferId UNIQUEIDENTIFIER NOT NULL,

    StartTime DATETIME2 NOT NULL,

    EndTime DATETIME2 NOT NULL,

    Capacity INT NOT NULL,

    IsActive BIT NOT NULL,

    CreatedAt DATETIME2 NOT NULL,

    CONSTRAINT FK_Slots_Offers
    FOREIGN KEY (OfferId)
    REFERENCES Offers(Id)
);
```

# Relationship

```text id="g2w7pa"
1 Slot → Many Bookings
```

# Entity

```csharp id="r8m5kc"
public class Slot
{
    public Guid Id { get; set; }

    public Guid OfferId { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }

    public int Capacity { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public Offer Offer { get; set; }

    public ICollection<Booking> Bookings { get; set; }
}
```

---

# 5. BOOKINGS TABLE

Purpose:

```text id="f4p7zx"
customer reservations
```

# Schema

```sql id="l0q9mv"
CREATE TABLE Bookings (
    Id UNIQUEIDENTIFIER PRIMARY KEY,

    BookingReference NVARCHAR(100) NOT NULL,

    OfferId UNIQUEIDENTIFIER NOT NULL,

    SlotId UNIQUEIDENTIFIER NOT NULL,

    CustomerName NVARCHAR(150) NOT NULL,

    CustomerPhone NVARCHAR(20) NOT NULL,

    CustomerEmail NVARCHAR(150),

    PeopleCount INT NOT NULL,

    SpecialNote NVARCHAR(MAX),

    Status INT NOT NULL,

    CreatedAt DATETIME2 NOT NULL,

    CONSTRAINT FK_Bookings_Offers
    FOREIGN KEY (OfferId)
    REFERENCES Offers(Id),

    CONSTRAINT FK_Bookings_Slots
    FOREIGN KEY (SlotId)
    REFERENCES Slots(Id)
);
```

IMPORTANT:

```text id="y8t3kw"
NO CASCADE DELETE on Bookings
```

because you already fixed:

```text id="c5v1ne"
multiple cascade path issue
```

# Entity

```csharp id="m7p2ra"
public class Booking
{
    public Guid Id { get; set; }

    public string BookingReference { get; set; }

    public Guid OfferId { get; set; }

    public Guid SlotId { get; set; }

    public string CustomerName { get; set; }

    public string CustomerPhone { get; set; }

    public string CustomerEmail { get; set; }

    public int PeopleCount { get; set; }

    public string SpecialNote { get; set; }

    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public Offer Offer { get; set; }

    public Slot Slot { get; set; }
}
```

---

# COMPLETE RELATIONSHIPS

# One-to-Many

```text id="x1m6qw"
Business → Offers
Offer → Slots
Slot → Bookings
```

---

# ER DIAGRAM

```text id="n8k3ya"
Users
│

Businesses
│
└── Offers
      │
      └── Slots
            │
            └── Bookings
```

---

# ENUMS

# UserRole

```csharp id="u5r7pb"
public enum UserRole
{
    Admin = 1
}
```

---

# OfferStatus

```csharp id="d9q2km"
public enum OfferStatus
{
    Active = 1,
    Inactive = 2
}
```

---

# BookingStatus

```csharp id="h7w4xn"
public enum BookingStatus
{
    Confirmed = 1,
    Cancelled = 2
}
```

---

# IMPORTANT DATABASE CONCEPTS YOU ARE USING

# 1. Primary Keys

```sql id="s3n8vt"
PRIMARY KEY
```

Unique row identifier.

Using:

```text id="f6m1qa"
GUIDs
```

instead of integer IDs.

Better for:

* distributed systems
* APIs
* security

---

# 2. Foreign Keys

```sql id="k4y9pb"
FOREIGN KEY
```

Maintains:

```text id="p8v3nm"
referential integrity
```

Prevents invalid data.

---

# 3. Navigation Properties

```csharp id="w2q7lc"
public Offer Offer { get; set; }
```

Allows EF Core relationships.

---

# 4. One-to-Many Relationships

Example:

```text id="t6m8xy"
One Offer
Many Slots
```

Industry-standard relational modeling.

---

# 5. Aggregation Support

Your schema supports:

* revenue analytics
* occupancy %
* booking reports
* dashboard metrics

Very scalable design.

---

# WHY THIS SCHEMA IS GOOD

Your database now supports:

* scalable bookings
* analytics
* filtering
* dashboards
* future payments
* notifications
* real-time booking
* admin systems

