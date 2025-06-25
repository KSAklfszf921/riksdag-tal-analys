
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';

const ApiStatus = () => {
  return (
    <div className="text-xs text-gray-500 text-center">
      <Badge variant="outline" className="mr-2">
        <Calendar className="h-3 w-3 mr-1" />
        Data från 1993/94
      </Badge>
      <Badge variant="outline">
        <Users className="h-3 w-3 mr-1" />
        Riksdagens API
      </Badge>
    </div>
  );
};

export default ApiStatus;
