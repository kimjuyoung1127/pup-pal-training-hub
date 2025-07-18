-- Create the articles table
CREATE TABLE articles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    content text,
    category text NOT NULL,
    author_name text,
    author_avatar_url text,
    featured_image_url text,
    status text NOT NULL DEFAULT 'draft'
);

-- Add comments to the columns
COMMENT ON COLUMN articles.title IS 'Title of the article';
COMMENT ON COLUMN articles.slug IS 'URL-friendly slug for the article';
COMMENT ON COLUMN articles.content IS 'Content of the article in Markdown format';
COMMENT ON COLUMN articles.category IS 'Category of the article (e.g., "Expert Column", "Pet-Tech")';
COMMENT ON COLUMN articles.author_name IS 'Name of the author';
COMMENT ON COLUMN articles.author_avatar_url IS 'URL for the author''s avatar image';
COMMENT ON COLUMN articles.featured_image_url IS 'URL for the article''s featured image';
COMMENT ON COLUMN articles.status IS 'Status of the article (e.g., "draft", "published")';

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows public read access to published articles
CREATE POLICY "Allow public read access to published articles"
ON articles
FOR SELECT
USING (status = 'published');

-- Create a policy that allows users to manage their own articles (optional, for future use)
-- CREATE POLICY "Allow users to manage their own articles"
-- ON articles
-- FOR ALL
-- USING (auth.uid() = author_id) -- Assuming you add an author_id column linked to auth.users
-- WITH CHECK (auth.uid() = author_id);
