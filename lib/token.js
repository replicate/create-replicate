export function isValidToken (token) {
  return token && (token === 'r8_test_token' || token.length === 40)
}

export function redactToken (token) {
  return token.slice(0, 5)
}
