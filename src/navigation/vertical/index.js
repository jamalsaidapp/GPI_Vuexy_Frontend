import dashboard from '@/navigation/vertical/lists/dashboard'
import helpdesk from '@/navigation/vertical/lists/helpdesk'
import settings from '@/navigation/vertical/lists/settings'
import gestion_pc from '@/navigation/vertical/lists/gestion_pc'

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
