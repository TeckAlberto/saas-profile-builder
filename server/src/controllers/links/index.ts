import { Router } from 'express'

import { authMiddleware } from '../../middleware/auth.middleware'

import create from './create'
import deleteLink from './delete'
import getByUserId from './getByUserId'
import saveOrder from './saveOrder'

const router: Router = Router()

router.use(authMiddleware)

router.post('/', create)
router.get('/', getByUserId)
router.patch('/order', saveOrder)
router.delete('/:linkId', deleteLink)

export default router
