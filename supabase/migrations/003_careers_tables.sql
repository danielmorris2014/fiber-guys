-- ═══════════════════════════════════════════════════════════════
-- Careers System Tables
-- Run in Supabase SQL editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════

-- 1. Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  years_experience TEXT,
  has_cdl TEXT,
  equipment_experience TEXT,
  resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'under_review', 'interview', 'offered', 'hired', 'not_selected')),
  status_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_notes TEXT
);

-- Index for status lookup by email
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_tracking ON applications (tracking_number);

-- 2. Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_name TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  referrer_phone TEXT,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_phone TEXT,
  position TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'contacted', 'hired', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create application-files storage bucket (if not exists)
-- Run this separately if needed:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('application-files', 'application-files', false)
-- ON CONFLICT (id) DO NOTHING;
