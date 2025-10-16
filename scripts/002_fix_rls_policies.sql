-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;

-- Fix group_members policies to avoid infinite recursion
-- Users can see their own memberships directly
CREATE POLICY "Users can view their own memberships"
  ON public.group_members FOR SELECT
  USING (user_id = auth.uid());

-- Users can also see other members in groups they belong to
-- This uses a function to avoid recursion
CREATE OR REPLACE FUNCTION public.user_is_group_member(group_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = group_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Users can view members in their groups"
  ON public.group_members FOR SELECT
  USING (user_is_group_member(group_id));

-- Simplified admin policy
CREATE POLICY "Group admins can remove members"
  ON public.group_members FOR DELETE
  USING (
    user_id = auth.uid() OR -- Users can leave groups
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role = 'admin'
    )
  );

-- Add policy to allow viewing groups by invite code (for joining)
DROP POLICY IF EXISTS "Users can view groups they are members of" ON public.groups;

CREATE POLICY "Users can view their groups"
  ON public.groups FOR SELECT
  USING (
    user_is_group_member(id) OR
    invite_code IS NOT NULL -- Allow viewing by invite code for joining
  );
