-- Better Auth 必須テーブル (Turso ダッシュボード > Query タブで実行してください)

CREATE TABLE IF NOT EXISTS "user" (
    "id"            TEXT     NOT NULL PRIMARY KEY,
    "name"          TEXT     NOT NULL,
    "email"         TEXT     NOT NULL UNIQUE,
    "emailVerified" INTEGER  NOT NULL DEFAULT 0,
    "image"         TEXT,
    "createdAt"     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "session" (
    "id"         TEXT     NOT NULL PRIMARY KEY,
    "expiresAt"  DATETIME NOT NULL,
    "token"      TEXT     NOT NULL UNIQUE,
    "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress"  TEXT,
    "userAgent"  TEXT,
    "userId"     TEXT     NOT NULL REFERENCES "user" ("id")
);

CREATE TABLE IF NOT EXISTS "account" (
    "id"                      TEXT     NOT NULL PRIMARY KEY,
    "accountId"               TEXT     NOT NULL,
    "providerId"              TEXT     NOT NULL,
    "userId"                  TEXT     NOT NULL REFERENCES "user" ("id"),
    "accessToken"             TEXT,
    "refreshToken"            TEXT,
    "idToken"                 TEXT,
    "accessTokenExpiresAt"    DATETIME,
    "refreshTokenExpiresAt"   DATETIME,
    "scope"                   TEXT,
    "password"                TEXT,
    "createdAt"               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "verification" (
    "id"         TEXT     NOT NULL PRIMARY KEY,
    "identifier" TEXT     NOT NULL,
    "value"      TEXT     NOT NULL,
    "expiresAt"  DATETIME NOT NULL,
    "createdAt"  DATETIME,
    "updatedAt"  DATETIME
);
