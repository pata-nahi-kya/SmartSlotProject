# Explore SmartSlot.API backend
_Exported on 5/24/2026 at 10:55:26 GMT+5:30 from Cursor (3.5.33)_

---

**User**

Thoroughly explore the SmartSlot.API project at E:/SmartSlotProject/SmartSlot.API. Return a structured report covering:

1. Project structure (controllers, services, models, DTOs, interfaces)
2. All API endpoints (HTTP method, route, auth requirements, request/response shapes)
3. Authentication/authorization approach (JWT, roles, etc.)
4. Domain models and enums (booking status, slot status, offer status, etc.)
5. Key business logic in services
6. Any appsettings, CORS, or startup configuration relevant to frontend integration

Read actual source files - don't guess. Include file paths for key files.

---

**Cursor**

I'll explore the SmartSlot.API project systematically — starting with its layout, then controllers, services, models, and configuration.


I have enough source detail to compile the full report.


# SmartSlot.API — Structured Exploration Report

**Project root:** `E:/SmartSlotProject/SmartSlot.API`  
**Stack:** ASP.NET Core 8.0, EF Core + SQL Server, JWT Bearer auth, Swagger, BCrypt

---

## 1. Project Structure

```
SmartSlot.API/
├── Controllers/          # 6 API controllers
├── Services/             # 6 service implementations
├── Interfaces/           # 6 service interfaces
├── Entities/             # 5 domain entities
├── Enums/                # 4 enums
├── DTOs/
│   ├── Auth/
│   ├── Business/
│   ├── Offer/
│   ├── Booking/
│   ├── Slot/
│   ├── Dashboard/
│   └── Common/
├── Data/
│   └── AppDbContext.cs
├── Helpers/
│   ├── JwtHelper.cs
│   └── PasswordHasher.cs
├── Middleware/
│   └── ExceptionMiddleware.cs
├── Migrations/
├── Properties/
│   └── launchSettings.json
├── Program.cs            # Startup, DI, CORS, JWT, Swagger
├── appsettings.json
└── SmartSlot.API.csproj
```

| Layer | Files |
|-------|-------|
| **Controllers** | `AuthController.cs`, `BusinessController.cs`, `OffersController.cs` (class: `OfferController`), `BookingsController.cs` (class: `BookingController`), `SlotsController.cs` (class: `SlotController`), `DashboardController.cs` |
| **Services** | `AuthService.cs`, `BusinessService.cs`, `OfferService.cs`, `BookingService.cs`, `SlotService.cs`, `DashboardService.cs` |
| **Interfaces** | `IAuthService.cs`, `IBusinessService.cs`, `IOfferService.cs`, `IBookingService.cs`, `ISlotService.cs`, `IDashboardService.cs` |
| **Entities** | `User.cs`, `Business.cs`, `Offer.cs`, `Slot.cs`, `Booking.cs` |
| **Enums** | `UserRole.cs`, `BookingStatus.cs`, `SlotStatus.cs`, `OfferStatus.cs` |

**Note:** Controller class names use singular forms (`OfferController`, `BookingController`, `SlotController`), so ASP.NET route tokens resolve to `/api/Offer`, `/api/Booking`, `/api/Slot` — not plural.

---

## 2. All API Endpoints

Base URL (dev): `http://localhost:5113` or `https://localhost:7246`  
Auth header when required: `Authorization: Bearer <jwt_token>`

### Auth — `E:/SmartSlotProject/SmartSlot.API/Controllers/AuthController.cs`

| Method | Route | Auth | Request | Success Response |
|--------|-------|------|---------|------------------|
| POST | `/api/Auth/register` | None | `RegisterRequestDto`: `{ name, email, password }` | `200`: `{ message: "User registered successfully" }` |
| POST | `/api/Auth/login` | None | `LoginRequestDto`: `{ email, password }` | `200`: `LoginResponseDto` `{ token, email, role }` or `401`: `{ message: "Invalid credentials" }` |

### Business — `E:/SmartSlotProject/SmartSlot.API/Controllers/BusinessController.cs`

| Method | Route | Auth | Request | Success Response |
|--------|-------|------|---------|------------------|
| POST | `/api/Business` | **JWT required** | `CreateBusinessDto` (body) | `200`: `BusinessResponseDto` |
| GET | `/api/Business` | None | — | `200`: `BusinessResponseDto[]` |
| GET | `/api/Business/{id}` | None | `id`: Guid | `200`: `BusinessResponseDto` or `404`: `{ message: "Business not found" }` |

**`CreateBusinessDto`:** `{ name, businessType, ownerName, phone, email, address, city, openingTime, closingTime }` (TimeSpan for times)  
**`BusinessResponseDto`:** `{ id, name, businessType, ownerName, phone, email, address, city }` (no opening/closing times in response)

### Offer — `E:/SmartSlotProject/SmartSlot.API/Controllers/OffersController.cs`

| Method | Route | Auth | Request | Success Response |
|--------|-------|------|---------|------------------|
| POST | `/api/Offer` | **JWT required** | `CreateOfferDto` (body) | `200`: `OfferResponseDto` |
| GET | `/api/Offer` | None | — | `200`: `OfferResponseDto[]` |
| GET | `/api/Offer/{id}` | None | `id`: Guid | `200`: `OfferResponseDto` or `404` |
| GET | `/api/Offer/search` | None | Query: `OfferSearchDto` | `200`: `PaginatedResponseDto<OfferResponseDto>` |

**`CreateOfferDto`:** `{ businessId, title, description, category, originalPrice, offerPrice, startDate, endDate, termsAndConditions }`  
**`OfferResponseDto`:** `{ id, businessId, title, description, category, originalPrice, offerPrice, discountPercentage, startDate, endDate, termsAndConditions, status }` (status as string)  
**`OfferSearchDto` query params:** `search`, `city`, `businessType`, `minPrice`, `maxPrice`, `page` (default 1), `pageSize` (default 10), `sortBy` (`price`, `price_desc`, `title`, default: startDate desc)

**`PaginatedResponseDto<T>`:** `{ data, totalRecords, currentPage, pageSize, totalPages }`

### Slot — `E:/SmartSlotProject/SmartSlot.API/Controllers/SlotsController.cs`

| Method | Route | Auth | Request | Success Response |
|--------|-------|------|---------|------------------|
| GET | `/api/Slot/offer/{offerId}` | None | `offerId`: Guid | `200`: `SlotResponseDto[]` |
| POST | `/api/Slot` | None | `CreateSlotDto` (body) | `200`: raw `Slot` entity |

**`CreateSlotDto`:** `{ offerId, startTime, endTime, capacity }` (DateTime; date/time split internally)  
**`SlotResponseDto`:** `{ id, offerId, startTime, endTime, capacity, isAvailable }`  
**POST response:** Returns full `Slot` entity (not DTO): `{ id, offerId, slotDate, startTime, endTime, capacity, bookedCount, status, bookings }`

### Booking — `E:/SmartSlotProject/SmartSlot.API/Controllers/BookingsController.cs`

| Method | Route | Auth | Request | Success Response |
|--------|-------|------|---------|------------------|
| POST | `/api/Booking` | None | `CreateBookingDto` | `200`: `BookingResponseDto` |
| GET | `/api/Booking` | **JWT required** | — | `200`: `BookingResponseDto[]` |

**`CreateBookingDto`:** `{ offerId, slotId, customerName, customerPhone, customerEmail?, peopleCount, specialNote? }`  
**`BookingResponseDto`:** `{ id, bookingReference, customerName, customerPhone, peopleCount, status, createdAt }`

### Dashboard — `E:/SmartSlotProject/SmartSlot.API/Controllers/DashboardController.cs`

Entire controller has `[Authorize]` — all endpoints require JWT.

| Method | Route | Request | Success Response |
|--------|-------|---------|------------------|
| GET | `/api/Dashboard/summary` | — | `DashboardSummaryDto` |
| GET | `/api/Dashboard/revenue` | — | `RevenueAnalyticsDto[]` |
| GET | `/api/Dashboard/recent-bookings` | — | `RecentBookingDto[]` (top 5) |

**`DashboardSummaryDto`:** `{ totalBusinesses, totalOffers, totalSlots, totalBookings, totalRevenue, activeOffers, occupancyRate }`  
**`RevenueAnalyticsDto`:** `{ offerTitle, totalBookings, revenue }`  
**`RecentBookingDto`:** `{ bookingReference, customerName, offerTitle, peopleCount, createdAt }`

### Global Error Shape — `E:/SmartSlotProject/SmartSlot.API/Middleware/ExceptionMiddleware.cs`

Unhandled exceptions return JSON `ErrorResponseDto`:
```json
{ "statusCode": 500, "message": "...", "details": "stack trace (dev only)", "timestamp": "..." }
```
Most service-thrown `Exception`s (e.g. "Slot not found") map to **500**, not 400.

---

## 3. Authentication & Authorization

**Config files:** `E:/SmartSlotProject/SmartSlot.API/Program.cs`, `Helpers/JwtHelper.cs`, `Services/AuthService.cs`, `appsettings.json`

### JWT Setup
- Scheme: `JwtBearerDefaults.AuthenticationScheme`
- Validates issuer, audience, lifetime, signing key from config
- Token lifetime: **7 days** (`JwtHelper.GenerateToken`)
- Claims embedded:
  - `ClaimTypes.NameIdentifier` → user Id
  - `ClaimTypes.Email` → email
  - `ClaimTypes.Role` → role string (`Admin` / `Customer`)

### Password Security
- BCrypt hashing via `PasswordHasher` (`BCrypt.Net-Next`)

### Registration Behavior
- All new users are assigned `UserRole.Admin` (hardcoded in `AuthService.RegisterAsync`)
- Duplicate email throws `"User already exists"`

### Authorization Model
- Uses `[Authorize]` attribute only — **no `[Authorize(Roles = "...")]` anywhere**
- Any valid JWT satisfies protected endpoints; role claim is issued but **not enforced**
- Public endpoints: login/register, list/get businesses, list/get/search offers, get/create slots, create booking
- Protected endpoints: create business, create offer, list bookings, all dashboard routes

### Frontend Integration
Send token as:
```
Authorization: Bearer <token>
```
Swagger UI is configured with Bearer security scheme for testing.

---

## 4. Domain Models & Enums

### Entities — `E:/SmartSlotProject/SmartSlot.API/Entities/`

**User**
- `Id`, `Name`, `Email`, `PasswordHash`, `Role` (enum), `CreatedAt`

**Business**
- `Id`, `Name`, `BusinessType`, `OwnerName`, `Phone`, `Email`, `Address`, `City`, `OpeningTime`, `ClosingTime`
- Navigation: `Offers` collection

**Offer**
- `Id`, `BusinessId`, `Title`, `Description`, `Category`, `OriginalPrice`, `OfferPrice`, `DiscountPercentage`, `StartDate`, `EndDate`, `TermsAndConditions`, `Status`
- Navigation: `Business`, `Slots`

**Slot**
- `Id`, `OfferId`, `SlotDate`, `StartTime`, `EndTime`, `Capacity`, `BookedCount`, `Status`
- Navigation: `Offer`, `Bookings`

**Booking**
- `Id`, `BookingReference`, `OfferId`, `SlotId`, `CustomerName`, `CustomerPhone`, `CustomerEmail?`, `PeopleCount`, `SpecialNote?`, `Status`, `CreatedAt`
- Navigation: `Offer`, `Slot`

### Enums — `E:/SmartSlotProject/SmartSlot.API/Enums/`

| Enum | Values |
|------|--------|
| **UserRole** | `Admin`, `Customer` |
| **BookingStatus** | `Pending`, `Confirmed`, `Cancelled`, `Completed`, `NoShow` |
| **SlotStatus** | `Available`, `Full`, `Closed`, `Expired`, `Cancelled` |
| **OfferStatus** | `Draft`, `Active`, `Paused`, `Expired`, `Cancelled` |

**Runtime usage:**
- New offers → `OfferStatus.Active`
- New bookings → `BookingStatus.Confirmed`
- Slot availability checks → `SlotStatus.Available` required to book
- Dashboard metrics exclude `BookingStatus.Cancelled`; active offers counted via `OfferStatus.Active`
- API responses serialize enum values as **strings** in DTOs

**Schema note:** Enums stored as `int` in SQL Server (see migrations). `Slot.BookedCount` exists on entity but is **not updated** by services — availability is computed from related bookings.

---

## 5. Key Business Logic in Services

### `AuthService` — `E:/SmartSlotProject/SmartSlot.API/Services/AuthService.cs`
- Register: email uniqueness check, BCrypt hash, always Admin role
- Login: verify password, return JWT + email + role

### `BusinessService` — `E:/SmartSlotProject/SmartSlot.API/Services/BusinessService.cs`
- Straight CRUD mapping; no validation beyond EF persistence
- Response DTO omits `OpeningTime`/`ClosingTime` even though they're stored

### `OfferService` — `E:/SmartSlotProject/SmartSlot.API/Services/OfferService.cs`
- Create: validates business exists; auto-calculates `DiscountPercentage`; defaults `Category` to `"General"`, `TermsAndConditions` to `"Standard terms apply."`, status to `Active`
- Search: filters by title/description, city, business type, price range; supports sorting and pagination

### `SlotService` — `E:/SmartSlotProject/SmartSlot.API/Services/SlotService.cs`
- Get by offer: loads bookings, computes `IsAvailable = bookedCount < capacity` (excluding cancelled bookings)
- Combines `SlotDate + StartTime/EndTime` into DateTime for API response
- Create: splits incoming DateTime into date + TimeSpan; does **not** set `Status` (defaults to `Available` = 0)

### `BookingService` — `E:/SmartSlotProject/SmartSlot.API/Services/BookingService.cs`
- Validates slot exists and `Status == Available`
- Capacity check: sums `PeopleCount` from non-cancelled bookings vs slot capacity
- Generates reference: `BK-{UtcNow.Ticks}`
- Always creates with `BookingStatus.Confirmed`
- Does not update slot `BookedCount` or `SlotStatus.Full`

### `DashboardService` — `E:/SmartSlotProject/SmartSlot.API/Services/DashboardService.cs`
- Summary: counts entities, revenue = sum of `Offer.OfferPrice` per non-cancelled booking (not multiplied by people count)
- Occupancy rate: `(total booked spots / total slot capacity) * 100`
- Revenue analytics: grouped by offer title
- Recent bookings: last 5 by `CreatedAt`

---

## 6. Configuration for Frontend Integration

### `appsettings.json` — `E:/SmartSlotProject/SmartSlot.API/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=SmartSlotDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "THIS_IS_SUPER_SECRET_KEY_123456789",
    "Issuer": "SmartSlotAPI",
    "Audience": "SmartSlotClient"
  },
  "AllowedHosts": "*",
  "https_port": 443
}
```

`appsettings.Development.json` only overrides logging levels.

### CORS — `Program.cs` lines 63–73, 116
Policy name: **`AllowAll`**
- `AllowAnyOrigin()`, `AllowAnyHeader()`, `AllowAnyMethod()`
- Suitable for local frontend dev; not production-hardened

### Startup Pipeline — `E:/SmartSlotProject/SmartSlot.API/Program.cs`
1. `ExceptionMiddleware` (global error handler)
2. Swagger + SwaggerUI at **root URL** (`RoutePrefix = ""`) → `http://localhost:5113/`
3. CORS
4. **`UseHttpsRedirection()` is commented out**
5. `UseAuthentication()` → `UseAuthorization()`
6. `MapControllers()`

### Dev URLs — `E:/SmartSlotProject/SmartSlot.API/Properties/launchSettings.json`

| Profile | URL |
|---------|-----|
| http | `http://localhost:5113` |
| https | `https://localhost:7246;http://localhost:5113` |
| IIS Express | `http://localhost:1534` |

### DI Registrations
All services scoped: `IAuthService`, `IBusinessService`, `IOfferService`, `IBookingService`, `ISlotService`, `IDashboardService`, plus `JwtHelper`.

### Database — `E:/SmartSlotProject/SmartSlot.API/Data/AppDbContext.cs`
- SQL Server via EF Core
- Booking→Slot FK uses `DeleteBehavior.NoAction` (avoids cascade cycles)
- Decimal precision 18,2 on offer prices

---

## Notable Gaps / Frontend Caveats

1. **Route naming:** Use singular paths (`/api/Offer`, not `/api/Offers`).
2. **No role enforcement:** Dashboard comment says "administrators" but any authenticated user can access protected routes.
3. **Public admin actions:** `POST /api/Slot` and `POST /api/Booking` have no auth.
4. **Inconsistent POST responses:** Slot create returns raw entity; others return DTOs.
5. **Business logic errors return 500:** Service exceptions aren't typed for 400/404 mapping.
6. **Slot status not maintained:** Booking doesn't flip slot to `Full`; `BookedCount` column unused.
7. **Revenue calculation:** Uses flat `OfferPrice` per booking, not `OfferPrice * PeopleCount`.

---

## Key File Index

| Purpose | Path |
|---------|------|
| Startup / CORS / JWT | `E:/SmartSlotProject/SmartSlot.API/Program.cs` |
| DB context | `E:/SmartSlotProject/SmartSlot.API/Data/AppDbContext.cs` |
| JWT generation | `E:/SmartSlotProject/SmartSlot.API/Helpers/JwtHelper.cs` |
| Error middleware | `E:/SmartSlotProject/SmartSlot.API/Middleware/ExceptionMiddleware.cs` |
| Config | `E:/SmartSlotProject/SmartSlot.API/appsettings.json` |
| Launch URLs | `E:/SmartSlotProject/SmartSlot.API/Properties/launchSettings.json` |
| All controllers | `E:/SmartSlotProject/SmartSlot.API/Controllers/` |
| All services | `E:/SmartSlotProject/SmartSlot.API/Services/` |
| All DTOs | `E:/SmartSlotProject/SmartSlot.API/DTOs/` |
| All entities | `E:/SmartSlotProject/SmartSlot.API/Entities/` |
| All enums | `E:/SmartSlotProject/SmartSlot.API/Enums/` |

