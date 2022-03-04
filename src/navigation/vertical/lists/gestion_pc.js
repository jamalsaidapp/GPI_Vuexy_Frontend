export default [
    {
        title: 'Gestion PC',
        icon: 'MonitorIcon',
        children: [
            {
                title: 'Mes Ordinateurs',
                route: 'ordinateurs',
                resource: 'ordinateurs',
                action: 'read',
            },
            {
                title: 'Ordinateurs Affecter',
                route: 'affectations_pc',
                resource: 'affectations_pc',
                action: 'read',
            },
            {
                title: "Historique D'Affec",
                route: 'historique_pc',
                resource: 'historique_pc',
                action: 'read',
            },
        ],
    },
]
