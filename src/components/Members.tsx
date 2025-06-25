import React, { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { Member } from '@/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Members = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMembers = async () => {
      const { data, error } = await supabase
        .from('ledamoter')
        .select('id,tilltalsnamn,efternamn,parti,bild_url')
        .order('efternamn')
      if (!error && data) setMembers(data)
      setLoading(false)
    }
    loadMembers()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Laddar ledamöter...</div>
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {members.map((m) => (
        <Card key={m.id}>
          <CardHeader className="flex items-center gap-3">
            <Avatar>

              <AvatarImage
                src={m.bild_url}
                alt={`Foto på ${m.tilltalsnamn} ${m.efternamn}`}
                referrerPolicy="no-referrer"
              />

            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default Members
