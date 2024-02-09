import { describe, expect, it } from 'vitest'
import { isValidToken, redactToken } from '../lib/token.js'

describe('isValidToken', () => {
  it('allows newer prefixed API tokens', () => {
    const token = 'r8_4567890123456789012345678901234567890'
    expect(isValidToken(token)).toBe(true)
  })
  it('allows older API tokens', () => {
    const token = '1234567890123456789012345678901234567890'
    expect(isValidToken(token)).toBe(true)
  })

  it('allows special-cased test token', () => {
    const token = 'r8_test_token'
    expect(isValidToken(token)).toBe(true)
  })

  it('disallows invalid tokens', () => {
    const token = 'r8_not_a_real_token'
    expect(isValidToken(token)).toBe(false)
  })
})

describe('redactToken', () => {
  it('displays the first few characters of the token', () => {
    const token = 'r8_4567890123456789012345678901234567890'
    expect(redactToken(token)).toBe('r8_45')
  })

  it('works for old tokens too', () => {
    const token = '1234567890123456789012345678901234567890'
    expect(redactToken(token)).toBe('12345')
  })
})
