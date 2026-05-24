# SmartSlot Security Guide

## Secrets & configuration

| Setting | How to set | Notes |
|---------|------------|-------|
| `Jwt:Key` | User Secrets, env `Jwt__Key`, or `appsettings.Development.json` | **Minimum 32 characters.** Never commit production keys. |
| Connection string | User Secrets or env | Use SQL auth with least privilege in production. |
| `Cors:AllowedOrigins` | `appsettings.json` | List only trusted frontend URLs. |
| `Security:AllowAdminSelfRegistration` | `false` in production | Prevents public Admin signup. |

### Local development (.NET User Secrets)

```bash
cd SmartSlot.API
dotnet user-secrets set "Jwt:Key" "YourLocalDevKey_AtLeast32CharactersLong!"
```

## Authentication

- **JWT** with HMAC-SHA256; default **1 day** expiry (7 days in Development).
- Passwords hashed with **BCrypt** (work factor 12).
- Password policy: 8–128 chars, upper + lower + digit.
- Login/register responses do not reveal whether email exists.

## Authorization (role enforcement)

| Role | Access |
|------|--------|
| **Admin** | Dashboard, create business/offer/slot, all bookings, delete offers |
| **Customer** | `/booking/me`, cancel own bookings |
| **Anonymous** | Browse offers, create guest booking, track by reference |

## API hardening

- **CORS** restricted to configured origins (not `AllowAnyOrigin`).
- **Rate limiting** on auth, booking lookup, and global per-IP traffic.
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, HSTS when HTTPS.
- **Swagger** enabled only in Development.
- **HTTPS** redirection + HSTS outside Development.
- **Public booking lookup** returns masked phone only; reference format validated.

## Frontend

- Tokens stored in `localStorage` (acceptable for SPA demos; for production consider httpOnly cookies + BFF).
- API base URL via `VITE_API_URL` (see `.env.example`).
- 401 responses clear session and redirect to login.

## Production checklist

- [ ] Set strong `Jwt:Key` via environment variable
- [ ] Set `Security:AllowAdminSelfRegistration` to `false`
- [ ] Set `Security:RequireHttps` to `true`
- [ ] Configure `Cors:AllowedOrigins` for production domain only
- [ ] Use HTTPS termination (reverse proxy / Azure / etc.)
- [ ] Disable detailed errors (`ASPNETCORE_ENVIRONMENT=Production`)
- [ ] Review SQL connection string permissions
- [ ] Rotate JWT signing key periodically
