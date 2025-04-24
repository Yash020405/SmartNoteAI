# Database Setup Instructions for Supabase

Follow these steps to properly set up your Supabase database for the AI Notes app:

## 1. Create a New Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Enter a name for your project
4. Set a secure database password (save it somewhere safe)
5. Choose a region closest to your users
6. Click "Create new project"

## 2. Get Your API Keys

Once your project is created:

1. Go to the project dashboard
2. Click on the gear icon (Settings) in the sidebar
3. Click on "API" in the sidebar
4. Copy the "URL" and "anon/public" key
5. Paste these values in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_copied_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_copied_anon_key
   ```

## 3. Create the Notes Table

You need to create a table to store the notes:

1. Go to the "Table Editor" in the sidebar
2. Click "New Table"
3. Configure the table as follows:
   - Name: `notes`
   - Enable "Enable Row Level Security (RLS)"
   - Add the following columns:

   | Name        | Type        | Default Value      | Primary | Nullable |
   |-------------|-------------|-------------------|---------|----------|
   | id          | uuid        | uuid_generate_v4() | Yes     | No       |
   | user_id     | uuid        | (none)            | No      | No       |
   | title       | text        | (none)            | No      | No       |
   | content     | text        | (none)            | No      | No       |
   | summary     | text        | (none)            | No      | Yes      |
   | created_at  | timestamptz | now()             | No      | No       |
   | updated_at  | timestamptz | now()             | No      | No       |

4. Click "Save" to create the table

## 4. Set Up Foreign Key Relationship

1. Edit the `notes` table
2. Click on the `user_id` column
3. Under "Foreign Keys", configure:
   - Referenced Schema: `auth`
   - Referenced Table: `users`
   - Referenced Column: `id`
   - On Delete: `CASCADE`
4. Save changes

## 5. Create Row Level Security Policies

These policies ensure that users can only access their own notes:

1. Go to "Authentication" > "Policies" in the sidebar
2. Find the `notes` table and click "New Policy"
3. Use the policy template "Enable read access to everyone"
4. Modify the policy statement to:
   ```sql
   (auth.uid() = user_id)
   ```
5. Name it "Users can only view their own notes"
6. Click "Save Policy"

7. Add another policy for insert operations:
   - Click "New Policy"
   - Use template "Enable insert access to everyone"
   - Set the policy statement to:
   ```sql
   (auth.uid() = user_id)
   ```
   - Name it "Users can insert their own notes"
   - Click "Save Policy"

8. Add a policy for update operations:
   - Click "New Policy"
   - Use template "Enable update access to everyone"
   - Set the policy statement to:
   ```sql
   (auth.uid() = user_id)
   ```
   - Name it "Users can update their own notes"
   - Click "Save Policy"

9. Add a policy for delete operations:
   - Click "New Policy"
   - Use template "Enable delete access to everyone"
   - Set the policy statement to:
   ```sql
   (auth.uid() = user_id)
   ```
   - Name it "Users can delete their own notes"
   - Click "Save Policy"

## 6. Create Trigger for Updated At

Create a function to automatically update the `updated_at` field:

1. Go to "SQL Editor" in the sidebar
2. Create a new query and run the following SQL:

```sql
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger on notes table
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
```

## 7. Test Your Setup

After completing these steps:

1. Restart your Next.js development server
2. Try to create a new note
3. Verify that it appears in the notes list
4. Check that you can edit and delete the note

If you encounter any issues, check the browser console for error messages and make sure all the above steps were completed correctly. 