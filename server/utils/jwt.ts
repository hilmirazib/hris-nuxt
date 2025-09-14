import jwt from 'jsonwebtoken'
export type JwtPayload = { sub: number }

export const signJwt = (payload: JwtPayload, secret: string, exp: number = 60 * 60 * 24) =>
  jwt.sign(payload, secret, { expiresIn: exp })

export const verifyJwt = <T = JwtPayload>(token: string, secret: string) =>
  jwt.verify(token, secret) as T
