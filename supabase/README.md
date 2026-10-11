# KrishiMitra — Supabase Architecture & Database Blueprint

This directory prepares the project for Phase 2 Supabase PostgreSQL database integration and authentication.

## Planned Schema Architecture

- **`profiles`**: Farmer user profiles (district, phone, preferred language, landholding size).
- **`farms`**: Farm plot details (coordinates, soil type, irrigation source).
- **`crops`**: Active crop cycles per plot (sowing date, variety, stage, acreage).
- **`disease_scans`**: Historical camera scans, detected pathogen/pest, confidence score, treatment recommended.
- **`advisory_chats`**: Bilingual AI conversation history with Malayalam text/audio metadata.
- **`market_watchlists`**: Favorite local APMC mandis and commodities for price alerts.
- **`pgvector / knowledge_base`**: Embeddings for Kerala Agricultural University (KAU) Package of Practices and advisories.

## Getting Started in Phase 2
1. Create a Supabase project.
2. Run `schema.sql` in the Supabase SQL editor.
3. Add the project URL and anon key to `.env.local`.
