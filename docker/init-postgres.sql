-- Initialize PostgreSQL with pgvector extension

-- Enable pgvector extension on the default database
CREATE EXTENSION IF NOT EXISTS vector;

-- Create schema comment
COMMENT ON EXTENSION vector IS 'Vector data type for similarity search';
