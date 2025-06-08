import {Route} from 'express'
import { registerUser } from '../controllers/user.controller'

const router= Route()
router.route('register').post(registerUser)
export default router