import { Router } from 'express'

import getByName from './getByName'

const router: Router = Router()

router.get('/:name', getByName)

export default router
