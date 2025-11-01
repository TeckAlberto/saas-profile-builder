import { Router } from 'express'

import register from './register'
import login from './login'

const router: Router = Router()

router.post('/register', register)
router.post('/login', login)

export default router
