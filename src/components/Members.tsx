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
              <AvatarImage src={m.bild_url} alt={m.tilltalsnamn} referrerPolicy="no-referrer" />
              <AvatarFallback>{m.tilltalsnamn[0]}{m.efternamn[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">
                {m.tilltalsnamn} {m.efternamn}
              </CardTitle>
              <p className="text-sm text-gray-500">{m.parti}</p>
              <p className="text-xs text-gray-500">Foto: Sveriges riksdag</p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default Members
