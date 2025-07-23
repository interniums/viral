import './load-env'
import { dataFetcherService } from '../lib/services/index'

async function run() {
  console.log('Starting data fetch...')
  await dataFetcherService.updateDatabaseWithFreshData()
  console.log('Data fetch complete.')
}

run()
