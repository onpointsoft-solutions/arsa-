import jwt from 'jsonwebtoken'
import config from '../config/index'

export interface JwtPayload {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export const generateTokens = (payload: JwtPayload): TokenPair => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })

  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  })

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload
}

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload
  } catch (error) {
    return null
  }
}
