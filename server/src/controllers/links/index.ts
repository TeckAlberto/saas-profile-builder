import { Router } from 'express'

import { authMiddleware } from '../../middleware/auth.middleware'

import create from './create'
import getByUserId from './getByUserId'

const router: Router = Router()

router.use(authMiddleware)

router.post('/', create)
router.get('/', getByUserId)

export default router
