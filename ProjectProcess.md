## 00-architecture
This application is basically:

``` text
Business creates offers        
		↓
Offers contain slots
        ↓
Customers book slots
        ↓
Admin manages bookings
```


We need:

1. Authentication System
2. Business Management
3. Offer Management
4. Slot Management
5. Booking System
6. Dashboard Analytics
7. Public Offer Pages

### High-Level Architecture

``` text
React Frontend
      ↓
ASP.NET Core Web API
      ↓
PostgreSQL Database
```

Frontend responsibilities:

- UI
- Forms
- API calls
- State handling

Backend responsibilities:

- Business logic
- Validation
- Database operations
- Authentication

Database responsibilities:

- Store data

# Final Tech Stack

Frontend:

```
React
TypeScript
Vite
TailwindCSS
Axios
React Router
React Hook Form
```

Backend:

```
ASP.NET Core 8 Web API
Entity Framework Core
JWT Authentication
Swagger
PostgreSQL
```

Database:
```
SQL server
```


### relationship diagram

```
Business
   |
   └── Offers
           |
           └── Slots
                   |
                   └── Bookings
```

# API Design

Now VERY important.

Good API naming.

# Auth APIs

```
POST /api/auth/login
POST /api/auth/register
```

---

# Business APIs

```
GET    /api/business
POST   /api/business
PUT    /api/business/{id}
```

---

# Offer APIs

```
GET    /api/offers
GET    /api/offers/{id}
POST   /api/offers
PUT    /api/offers/{id}
DELETE /api/offers/{id}
```

---

# Slot APIs

```
GET /api/offers/{offerId}/slots  
POST /api/slots  
PUT /api/slots/{id}  
DELETE /api/slots/{id}
```

---

# Booking APIs

```
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/{id}
PUT    /api/bookings/{id}/status
```

---

# Dashboard APIs

```
GET /api/dashboard/summary
```

# 11. Authentication Flow

Simple JWT auth.

Flow:

```
Login
  ↓
Backend validates credentials
  ↓
Backend generates JWT
  ↓
Frontend stores token
  ↓
Frontend sends token in headers
```

Header:

```
Authorization: Bearer token_here
```


### frontend folder structure
src
│
├── api
├── assets
├── components
├── layouts
├── pages
├── routes
├── hooks
├── context
├── types
├── utils
├── constants
├── styles
└── main.tsx

### backend folder structure

SmartSlot.API
│
├── Controllers
├── Data
├── DTOs
├── Entities
├── Services
├── Interfaces
├── Repositories
├── Helpers
├── Middleware
├── Configurations
├── Mappings
├── Enums
├── Validators
├── Migrations
└── Program.cs

----------------------------

# Build Order

# Phase 1

Backend Foundation

1. Create solution
2. Setup SQL
3. Setup EF Core
4. Create entities
5. Create migrations
6. Setup Swagger

# Phase 2

Authentication

7. JWT auth
8. Login API
9. Protect admin APIs

# Phase 3

Offer System

10. Offer CRUD
11. Slot CRUD
12. Business CRUD

# Phase 4

Booking System

13. Create booking
14. Validation logic
15. Capacity updates

# Phase 5

Frontend

16. Setup React
17. Setup Tailwind
18. Build pages
19. Connect APIs

# Phase 6

Polish

20. Dashboard
21. Responsive UI
22. Deployment
23. README
24. Demo video

-----------------------------

# Phase 1 starting at 10:22
✔ Create .NET project
✔ Configure SQL Server
✔ Setup Entity Framework Core
✔ Create database models
✔ Setup DbContext
✔ Create first migration
✔ Enable Swagger
✔ Test database connection



We start backend setup.

1. Install .NET 8 SDK


Then I went for deleting weatherforecastinf project configured in it and create folder structure.
SmartSlot.API
│
├── Controllers
│   ├── AuthController.cs
│   ├── BusinessController.cs
│   ├── OffersController.cs
│   ├── SlotsController.cs
│   ├── BookingsController.cs
│   └── DashboardController.cs
│
├── Data
│   ├── AppDbContext.cs
│   └── SeedData.cs
│
├── DTOs
│   │
│   ├── Auth
│   │   ├── LoginRequestDto.cs
│   │   ├── LoginResponseDto.cs
│   │   └── RegisterRequestDto.cs
│   │
│   ├── Business
│   │   ├── CreateBusinessDto.cs
│   │   ├── UpdateBusinessDto.cs
│   │   └── BusinessResponseDto.cs
│   │
│   ├── Offer
│   │   ├── CreateOfferDto.cs
│   │   ├── UpdateOfferDto.cs
│   │   └── OfferResponseDto.cs
│   │
│   ├── Slot
│   │   ├── CreateSlotDto.cs
│   │   ├── UpdateSlotDto.cs
│   │   └── SlotResponseDto.cs
│   │
│   └── Booking
│       ├── CreateBookingDto.cs
│       ├── UpdateBookingStatusDto.cs
│       └── BookingResponseDto.cs
│
├── Entities
│   ├── User.cs
│   ├── Business.cs
│   ├── Offer.cs
│   ├── Slot.cs
│   └── Booking.cs
│
├── Enums
│   ├── OfferStatus.cs
│   ├── SlotStatus.cs
│   ├── BookingStatus.cs
│   └── UserRole.cs
│
├── Interfaces
│   ├── IAuthService.cs
│   ├── IBusinessService.cs
│   ├── IOfferService.cs
│   ├── ISlotService.cs
│   ├── IBookingService.cs
│   └── IDashboardService.cs
│
├── Services
│   ├── AuthService.cs
│   ├── BusinessService.cs
│   ├── OfferService.cs
│   ├── SlotService.cs
│   ├── BookingService.cs
│   └── DashboardService.cs
│
├── Helpers
│   ├── JwtHelper.cs
│   ├── PasswordHasher.cs
│   ├── ApiResponse.cs
│   ├── GenerateBookingReference.cs
│   └── DateTimeHelper.cs
│
├── Middleware
│   └── ExceptionMiddleware.cs
│
├── Configurations
│   ├── SwaggerConfiguration.cs
│   ├── JwtConfiguration.cs
│   └── CorsConfiguration.cs
│
├── Validators
│   ├── OfferValidator.cs
│   ├── BookingValidator.cs
│   └── SlotValidator.cs
│
├── Mappings
│   └── MappingProfile.cs
│
├── Migrations
│
├── appsettings.json
├── appsettings.Development.json
├── Program.cs
└── SmartSlot.API.csproj
  
I have created this all structure using command line
# Create all directories and nested subdirectories
New-Item -ItemType Directory -Force -Path `
    "Controllers", "Data", "Entities", "Enums", "Interfaces", "Services", `
    "Helpers", "Middleware", "Configurations", "Validators", "Mappings", "Migrations", `
    "DTOs\Auth", "DTOs\Business", "DTOs\Offer", "DTOs\Slot", "DTOs\Booking"

# Create files inside Controllers
New-Item -ItemType File -Force -Path "Controllers\AuthController.cs", "Controllers\BusinessController.cs", "Controllers\OffersController.cs", "Controllers\SlotsController.cs", "Controllers\BookingsController.cs", "Controllers\DashboardController.cs"

# Create files inside Data
New-Item -ItemType File -Force -Path "Data\AppDbContext.cs", "Data\SeedData.cs"

# Create files inside Entities
New-Item -ItemType File -Force -Path "Entities\User.cs", "Entities\Business.cs", "Entities\Offer.cs", "Entities\Slot.cs", "Entities\Booking.cs"

# Create files inside Enums
New-Item -ItemType File -Force -Path "Enums\OfferStatus.cs", "Enums\SlotStatus.cs", "Enums\BookingStatus.cs", "Enums\UserRole.cs"

# Create files inside Interfaces
New-Item -ItemType File -Force -Path "Interfaces\IAuthService.cs", "Interfaces\IBusinessService.cs", "Interfaces\IOfferService.cs", "Interfaces\ISlotService.cs", "Interfaces\IBookingService.cs", "Interfaces\IDashboardService.cs"

# Create files inside Services
New-Item -ItemType File -Force -Path "Services\AuthService.cs", "Services\BusinessService.cs", "Services\OfferService.cs", "Services\SlotService.cs", "Services\BookingService.cs", "Services\DashboardService.cs"

# Create files inside Helpers
New-Item -ItemType File -Force -Path "Helpers\JwtHelper.cs", "Helpers\PasswordHasher.cs", "Helpers\ApiResponse.cs", "Helpers\GenerateBookingReference.cs", "Helpers\DateTimeHelper.cs"

# Create files inside Middleware, Configurations, Validators, Mappings
New-Item -ItemType File -Force -Path "Middleware\ExceptionMiddleware.cs"
New-Item -ItemType File -Force -Path "Configurations\SwaggerConfiguration.cs", "Configurations\JwtConfiguration.cs", "Configurations\CorsConfiguration.cs"
New-Item -ItemType File -Force -Path "Validators\OfferValidator.cs", "Validators\BookingValidator.cs", "Validators\SlotValidator.cs"
New-Item -ItemType File -Force -Path "Mappings\MappingProfile.cs"

# Create files inside DTO subfolders
New-Item -ItemType File -Force -Path "DTOs\Auth\LoginRequestDto.cs", "DTOs\Auth\LoginResponseDto.cs", "DTOs\Auth\RegisterRequestDto.cs"
New-Item -ItemType File -Force -Path "DTOs\Business\CreateBusinessDto.cs", "DTOs\Business\UpdateBusinessDto.cs", "DTOs\Business\BusinessResponseDto.cs"
New-Item -ItemType File -Force -Path "DTOs\Offer\CreateOfferDto.cs", "DTOs\Offer\UpdateOfferDto.cs", "DTOs\Offer\OfferResponseDto.cs"
New-Item -ItemType File -Force -Path "DTOs\Slot\CreateSlotDto.cs", "DTOs\Slot\UpdateSlotDto.cs", "DTOs\Slot\SlotResponseDto.cs"
New-Item -ItemType File -Force -Path "DTOs\Booking\CreateBookingDto.cs", "DTOs\Booking\UpdateBookingStatusDto.cs", "DTOs\Booking\BookingResponseDto.cs"

created with AI

-------------

Install Required Packages


Run these commands one by one:

Entity Framework Core
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
JWT Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
Swagger
dotnet add package Swashbuckle.AspNetCore
Password Hashing
Already included in ASP.NET.

------------


PHASE 2 starting at 2:17
✔ Register admin user
✔ Hash passwords securely
✔ Login API
✔ Generate JWT token
✔ Protect APIs
✔ Understand authentication architecture







