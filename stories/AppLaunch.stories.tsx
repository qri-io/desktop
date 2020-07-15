import React from 'react'

import IncompatibleBackend from '../app/components/IncompatibleBackend'
import MigratingBackend from '../app/components/MigratingBackend'
import MigrationFailed from '../app/components/MigrationFailed'

export default {
  title: 'App Launch',
  parameters: {
    notes: 'List of migration components rendered on app launch'
  }
}

export const incompatibleBackend = () => (<IncompatibleBackend incompatibleVersion='0.0.1'/>)

incompatibleBackend.story = {
  name: 'Incompatible Backend',
  parameters: { note: 'Screen when user is running an incompatible backend qri version' }
}

export const migratingBackend = () => <MigratingBackend />

migratingBackend.story = {
  name: 'Migrating Backend',
  parameters: { note: 'Screen when backend is in the process of migrating' }
}

export const migrationFailed = () => <MigrationFailed />

migratingBackend.story = {
  name: 'Migration Failed',
  parameters: { note: 'Screen when backend migration has failed' }
}