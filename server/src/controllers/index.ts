import { Router } from 'express'

import auth from './auth'
import links from './links'

const router: Router = Router()

router.use('/auth', auth)
router.use('/links', links)

export default router
