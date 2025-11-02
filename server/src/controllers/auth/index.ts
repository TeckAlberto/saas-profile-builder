import { Router } from 'express'

import register from './register'
import login from './login'

const router: Router = Router()

router.post('/register', (req, res) => void register(req, res))
router.post('/login', (req, res) => void login(req, res))

export default router
