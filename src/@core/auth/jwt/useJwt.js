/* eslint-disable import/no-cycle */
import JwtService from './jwtService'

export default function useJwt(axiosIns, jwtOverrideConfig) {
  const jwt = new JwtService(axiosIns, jwtOverrideConfig)

  return {
    jwt,
  }
}
