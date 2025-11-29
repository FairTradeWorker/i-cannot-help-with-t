-- SCALE: Database indexes for 1M users
-- Creates indexes to optimize queries at scale

-- Territory indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_territories_zip ON territories(zip_code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_territories_status ON territories(priority_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_territories_user ON territories(claimed_by_user_id) WHERE claimed_by_user_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_territories_created ON territories(created_at);

-- Job indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_zip ON jobs(territory_zip);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_homeowner ON jobs(homeowner_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_contractor ON jobs(contractor_id) WHERE contractor_id IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_created ON jobs(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_status_created ON jobs(status, created_at DESC);

-- User indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created ON users(created_at);

-- KV table indexes (for Supabase KV proxy)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kv_users_updated ON kv_users(updated_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kv_jobs_updated ON kv_jobs(updated_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kv_default_updated ON kv_default(updated_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_kv_territories_updated ON kv_territories(updated_at);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_territories_zip_status ON territories(zip_code, priority_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_jobs_zip_status ON jobs(territory_zip, status);

-- Analyze tables for query planner
ANALYZE territories;
ANALYZE jobs;
ANALYZE users;
ANALYZE kv_users;
ANALYZE kv_jobs;
ANALYZE kv_territories;

