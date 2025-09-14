#!/bin/bash

# This script applies the new migration to add extended profile fields
# Make sure you're in the project root directory and Supabase CLI is installed

echo "Applying migration to add extended profile fields..."

# Apply the migration
npx supabase migration up

if [ $? -eq 0 ]; then
    echo "Migration applied successfully!"
    
    # Regenerate types to include the new fields
    echo "Regenerating TypeScript types..."
    npx supabase gen types typescript --project-id $(npx supabase projects list | grep -o 'project_[a-zA-Z0-9]*') > src/types/supabase.ts
    
    echo "Types regenerated successfully!"
    echo "Please restart your development server to see the changes."
else
    echo "Migration failed. Please check the error messages above."
    exit 1
fi