---
title: JSON Web Tokens
slug: json-web-token
description: Repost from https://medium.com/@ambersariya/jwt-json-web-token-cd90ef7a7a66
modified: 2022-05-19T11:04:47.557Z
date: 2017-02-28T11:45:44.128Z
tags:
  - jwt
  - auth
last_updated: 2026-11-20T10:38:51.000Z
---

A JSON Web Token (JWT) carries claims between systems. A claim is a statement, such as who a token represents or when it expires.

A signed token lets a receiver check its integrity and that it was created by someone holding the signing key. That doesn't make the claims confidential, or make every action described by them authorised.

<!--truncate-->

## What a signed token contains

A common signed JWT uses three base64url-encoded parts, separated by dots:

```text
header.payload.signature
```

For example, the decoded header might be:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

And the payload:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

The signature covers the encoded header and payload. With HS256, it uses HMAC-SHA256 and a shared secret. Other algorithms use a private key to sign and a public key to verify. Use a maintained library rather than implementing this yourself. The signed format is defined in [RFC 7515](https://www.rfc-editor.org/rfc/rfc7515).

Anyone holding a signed token can decode its header and payload. Signing protects integrity, not confidentiality. Encrypted JWTs use a different representation.

## Common claims

[RFC 7519](https://www.rfc-editor.org/rfc/rfc7519) defines these registered claims:

| Claim | Meaning |
| --- | --- |
| `iss` | Issuer |
| `sub` | Subject, such as a user identifier |
| `aud` | Intended recipient or recipients |
| `exp` | Expiration time |
| `nbf` | Time before which the token is not accepted |
| `iat` | Time the token was issued |
| `jti` | Token identifier |

The time claims use seconds since the Unix epoch. `nbf` is a timestamp, not a delay after issuance. Claim names are case-sensitive. The application or token profile determines which claims are required and how to interpret custom claims such as `admin`.

## Using a token in an API

An authentication service can issue a token after checking a user's credentials. A client can then present it to an API using the Bearer scheme:

```http
Authorization: Bearer <access-token>
```

The API needs to validate the token before using its claims. For a signed access token, that includes checking the signature with an allowed algorithm and trusted key, then checking the expected issuer, audience and relevant time constraints. [RFC 8725](https://www.rfc-editor.org/rfc/rfc8725) covers JWT validation practices and common implementation failures.

A valid token isn't permission to do everything. The API still needs to decide whether the caller can perform the requested operation on the requested resource.

Authentication establishes who a caller is. Authorisation determines what that caller can do. A JWT can carry information used in those decisions; it doesn't replace them.

## What JWTs don't solve

**Revocation and stale claims.** If a user's permissions change, an already issued token may still contain the old values. Expiry limits its lifetime, but immediate revocation needs an additional mechanism, such as a server-side check. A `jti` value alone doesn't prevent replay.

**Browser security.** Token storage is a separate design choice. JWT doesn't prescribe local storage or cookies, and the format doesn't remove the risks of script access or cross-site requests.

**Cross-origin access.** Bearer tokens don't bypass [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS). A browser request with an `Authorization` header can require a preflight, and the server must allow the relevant origin and header.

**Server-side state.** An API may be able to validate a self-contained token without looking up a session on every request. That doesn't mean the whole application is stateless or never needs current permission data.

JWTs are useful when systems need to exchange verifiable claims. For a browser application, a server-side session may be simpler. Choose the authentication and session design first, then use a token format where it serves that design.
