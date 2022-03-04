import dashboard from '@/navigation/horizontal/lists/dashboard'
import helpdesk from '@/navigation/horizontal/lists/helpdesk'
import settings from '@/navigation/horizontal/lists/settings'
import gestion_pc from '@/navigation/horizontal/lists/gestion_pc'

// Array of sections
export default [...dashboard, ...settings, ...helpdesk, ...gestion_pc,
  {
    title: 'Profile',
    icon: 'UserIcon',
    route: 'profile',
    resource: 'profile',
    action: 'read',
  },
]
