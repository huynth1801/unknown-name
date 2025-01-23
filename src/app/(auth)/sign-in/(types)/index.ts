export type LoginResponse = {
  code: number
  result: {
    token: string
    authenticated: boolean
  }
}
