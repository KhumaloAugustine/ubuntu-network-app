# Database Schema

PostgreSQL schema for Ubuntu Network platform.

## Core Tables

### users
Primary user table with verification status and tier information.

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) NOT NULL UNIQUE, -- Encrypted
  verification_status SMALLINT DEFAULT 1, -- 1=pending, 2=verified, 3=trusted, 4=guardian
  tier_level SMALLINT DEFAULT 1, -- 1-4
  vouch_count INT DEFAULT 0,
  safety_rating DECIMAL(5,2) DEFAULT 0,
  last_verified_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_tier ON users(tier_level);
```

### vouches
Vouching relationships between users.

```sql
CREATE TABLE vouches (
  vouch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  giver_id UUID NOT NULL REFERENCES users(user_id),
  receiver_id UUID NOT NULL REFERENCES users(user_id),
  relationship_type VARCHAR(20) NOT NULL, -- 'family', 'friend', 'community', 'work'
  years_known VARCHAR(10) NOT NULL, -- '<1', '1-3', '3+'
  trust_level VARCHAR(20) NOT NULL, -- 'yes', 'no', 'supervised'
  note TEXT,
  vouch_date TIMESTAMP DEFAULT NOW(),
  vouch_status VARCHAR(20) DEFAULT 'active', -- 'active', 'revoked'
  revoked_date TIMESTAMP,
  revoked_reason TEXT
);

CREATE INDEX idx_vouches_receiver ON vouches(receiver_id);
CREATE INDEX idx_vouches_giver ON vouches(giver_id);
```

### safe_locations
Pre-approved safe meeting locations.

```sql
CREATE TABLE safe_locations (
  location_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_name VARCHAR(200) NOT NULL,
  gps_latitude DECIMAL(10,8) NOT NULL,
  gps_longitude DECIMAL(11,8) NOT NULL,
  address TEXT,
  verified_by UUID REFERENCES users(user_id),
  verification_date TIMESTAMP,
  safety_features JSONB, -- {lighting, cameras, visibility, etc.}
  hours_operation JSONB, -- {monday: '8-17', ...}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_safe_locations_gps ON safe_locations(gps_latitude, gps_longitude);
```

### activities
Activity requests and sessions.

```sql
CREATE TABLE activities (
  activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  helper_id UUID NOT NULL REFERENCES users(user_id),
  requester_id UUID NOT NULL REFERENCES users(user_id),
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP NOT NULL,
  scheduled_end TIMESTAMP NOT NULL,
  location_id UUID REFERENCES safe_locations(location_id),
  guardian_approval_id UUID REFERENCES users(user_id),
  parent_approval_id UUID REFERENCES users(user_id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, active, completed, cancelled
  start_gps_lat DECIMAL(10,8),
  start_gps_lng DECIMAL(11,8),
  end_gps_lat DECIMAL(10,8),
  end_gps_lng DECIMAL(11,8),
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  duration_minutes INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_helper ON activities(helper_id);
CREATE INDEX idx_activities_requester ON activities(requester_id);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_scheduled ON activities(scheduled_start);
```

### verification_photos
Photo verification records.

```sql
CREATE TABLE verification_photos (
  photo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id),
  photo_url TEXT NOT NULL, -- S3 URL
  verification_code VARCHAR(50) NOT NULL, -- Daily code shown in photo
  verification_date DATE NOT NULL,
  verified_by UUID REFERENCES users(user_id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_verification_photos_user ON verification_photos(user_id);
```

### incident_reports
Safety incident reports.

```sql
CREATE TABLE incident_reports (
  report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(user_id),
  reported_user_id UUID REFERENCES users(user_id),
  activity_id UUID REFERENCES activities(activity_id),
  description TEXT NOT NULL,
  evidence JSONB, -- URLs, screenshots, etc.
  status VARCHAR(20) DEFAULT 'pending', -- pending, investigating, resolved, closed
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
  assigned_to UUID REFERENCES users(user_id),
  resolution TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_incident_reports_reported_user ON incident_reports(reported_user_id);
CREATE INDEX idx_incident_reports_status ON incident_reports(status);
```

### audit_logs
Immutable audit log for all critical actions.

```sql
CREATE TABLE audit_logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  device_fingerprint VARCHAR(200),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

## Setup Instructions

1. **Install PostgreSQL** (v14+)

2. **Create database:**
   ```sql
   CREATE DATABASE ubuntu_network;
   ```

3. **Enable UUID extension:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

4. **Run schema:**
   ```bash
   psql -U postgres -d ubuntu_network -f db/schema.sql
   ```

5. **Update API .env:**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ubuntu_network
   ```

## Migrations

Use a migration tool like TypeORM, Prisma, or Knex for schema versioning in production.

## Security Notes

- All PII fields (phone_number, etc.) should be encrypted at application layer
- Use row-level security (RLS) policies in production
- Implement audit triggers for sensitive tables
- Regular backups with encryption
- 7-year retention for incident_reports
