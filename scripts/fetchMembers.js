import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const MEMBERS_URL = 'https://data.riksdagen.se/personlista/?utformat=json'

async function fetchMembers() {
  const res = await fetch(MEMBERS_URL)
  if (!res.ok) throw new Error(`Failed to fetch ${res.status}`)
  const data = await res.json()
  const list = data.personlista.person
  return Array.isArray(list) ? list : [list]
}

function mapMember(m) {
  return {
    id: m.intressent_id,
    tilltalsnamn: m.tilltalsnamn,
    efternamn: m.efternamn,
    parti: m.parti,
    bild_url: m.bild_url,
  }
}

async function main() {
  const members = await fetchMembers()
  const rows = members.map(mapMember)
  const { error } = await supabase
    .from('ledamoter')
    .upsert(rows, { onConflict: 'id', returning: 'minimal' })
  if (error) {
    console.error('Upsert failed', error)
    process.exit(1)
  }
  console.log(`Synced ${rows.length} members`)
}

main()
