-- ============================================
-- CORREÇÃO DEFINITIVA DE RECURSÃO INFINITA RLS
-- Execute este script completo no Supabase SQL Editor
-- ============================================

-- PROBLEMA: Erro "infinite recursion detected in policy for relation organizations" (código 42P17)
-- CAUSA: Política de SELECT em organizations verifica organization_members, causando loop infinito
-- SOLUÇÃO: Remover verificação de organization_members e usar apenas owner_id

BEGIN;

-- ============================================
-- 1. CORRIGIR POLÍTICA DE SELECT EM ORGANIZATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view their organizations" ON organizations;

CREATE POLICY "Users can view their organizations"
    ON organizations FOR SELECT
    USING (owner_id = auth.uid());

-- ============================================
-- 2. CORRIGIR POLÍTICA DE INSERT EM ORGANIZATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can insert their own organizations" ON organizations;

CREATE POLICY "Users can insert their own organizations"
    ON organizations FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- ============================================
-- 3. CORRIGIR POLÍTICA DE UPDATE EM ORGANIZATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can update their organizations" ON organizations;

CREATE POLICY "Users can update their organizations"
    ON organizations FOR UPDATE
    USING (owner_id = auth.uid());

-- ============================================
-- 4. CORRIGIR POLÍTICA DE INSERT EM ORGANIZATION_MEMBERS
-- ============================================
DROP POLICY IF EXISTS "Users can insert themselves as members" ON organization_members;

CREATE POLICY "Users can insert themselves as members"
    ON organization_members FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM organizations
            WHERE id = organization_id
            AND owner_id = auth.uid()
        )
    );

-- ============================================
-- 5. CORRIGIR POLÍTICA DE SELECT EM ORGANIZATION_MEMBERS
-- ============================================
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;

CREATE POLICY "Users can view members of their organizations"
    ON organization_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM organizations
            WHERE id = organization_id
            AND owner_id = auth.uid()
        )
        OR user_id = auth.uid()
    );

-- ============================================
-- 6. ATUALIZAR FUNÇÃO create_default_organization
-- ============================================
CREATE OR REPLACE FUNCTION create_default_organization()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
BEGIN
    INSERT INTO organizations (name, slug, owner_id, subscription_status, subscription_plan)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Minha Organização'),
        'org-' || substr(md5(random()::text), 1, 12),
        NEW.id,
        'trial',
        'free'
    )
    RETURNING id INTO new_org_id;
    
    INSERT INTO user_profiles (id, email, full_name, current_organization_id)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
        new_org_id
    )
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', user_profiles.full_name),
        current_organization_id = COALESCE(user_profiles.current_organization_id, new_org_id);
    
    INSERT INTO organization_members (organization_id, user_id, role, joined_at)
    VALUES (new_org_id, NEW.id, 'owner', NOW())
    ON CONFLICT (organization_id, user_id) DO NOTHING;
    
    INSERT INTO organization_settings (organization_id)
    VALUES (new_org_id)
    ON CONFLICT (organization_id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erro ao criar organização padrão para usuário %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ============================================
-- 7. GARANTIR QUE O TRIGGER EXISTE
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_default_organization();

-- ============================================
-- 8. REGISTRAR VERSÃO (se a tabela existir)
-- ============================================
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'schema_migrations') THEN
        INSERT INTO schema_migrations (version, description)
        VALUES ('5.0.0', 'Correção definitiva de recursão infinita - remove verificação de organization_members da política SELECT de organizations')
        ON CONFLICT (version) DO UPDATE SET
            description = EXCLUDED.description,
            applied_at = NOW();
    END IF;
END $$;

COMMIT;

-- ============================================
-- PRONTO! O problema de recursão foi corrigido.
-- Agora os usuários podem criar organizações sem erro.
-- ============================================

