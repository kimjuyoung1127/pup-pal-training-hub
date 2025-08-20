CREATE POLICY "Allow authenticated users to see articles-images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'articles-images');