import dashboard from '@/navigation/vertical/lists/dashboard'
import helpdesk from '@/navigation/vertical/lists/helpdesk'
import settings from '@/navigation/vertical/lists/settings'
// eslint-disable-next-line camelcase
import gestion_pc from '@/navigation/vertical/lists/gestion_pc'

// Array of sections
// eslint-disable-next-line camelcase
export default [...dashboard, ...gestion_pc, ...helpdesk, ...settings,
]
