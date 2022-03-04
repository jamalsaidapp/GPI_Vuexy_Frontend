// eslint-disable-next-line import/no-cycle
import useJwt from '@core/auth/jwt/useJwt'
import axios from '@axios'
import Axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000'
Axios.defaults.baseURL = 'http://localhost:8000'

const { jwt } = useJwt(axios, {})
export default jwt
