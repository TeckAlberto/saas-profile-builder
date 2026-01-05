import { Router } from 'express'

import auth from './auth'
import links from './links'
import users from './users'

const router: Router = Router()

router.use('/auth', auth)
router.use('/links', links)
router.use('/', users)

export default router
