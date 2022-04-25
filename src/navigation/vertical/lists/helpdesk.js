export default [
  {
    title: 'HelpDesk',
    icon: 'LifeBuoyIcon',
    children: [
      {
        title: 'Tickets',
        route: 'tickets',
        resource: 'helpdesk',
        action: 'read',
      },
      {
        title: 'Rapport des Tickets',
        route: 'tickets_rapport',
        resource: 'helpdesk',
        action: 'read',
      },
    ],
  },
]
