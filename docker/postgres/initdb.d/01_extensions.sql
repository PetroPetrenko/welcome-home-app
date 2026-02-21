-- ============================================================
-- 01_extensions.sql — Enable required PostgreSQL extensions
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log successful initialization
DO $$
BEGIN
  RAISE NOTICE 'InvestProp database initialized successfully';
END $$;
