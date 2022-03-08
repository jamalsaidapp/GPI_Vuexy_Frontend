// eslint-disable-next-line import/no-cycle
import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import Axios from 'axios'

axios.defaults.baseURL = 'http://192.168.2.243:8000'
Axios.defaults.baseURL = 'http://192.168.2.243:8000'

const { jwt } = useJwt(axios, {})
export default jwt
