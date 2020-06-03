import { queryWord, query } from '../query'

describe('queryWord', () => {
  it('query wiki_id', () => {
    expect(queryWord('A01')).toContain(101)
    expect(queryWord('A02')).toContain(102)
  })

  it('queryWord is case insensitive', () => {
    expect(queryWord('A')).toEqual(queryWord('a'))
    expect(queryWord('B')).toEqual(queryWord('b'))
  })
})

describe('query', () => {
  it('query multiple words is idempotent', () => {
    expect(query('A B').sort((a, b) => a - b)).toEqual(
      Array.from(new Set([...query('A'), ...query('B')])).sort((a, b) => a - b),
    )
  })

  it('query split multiple blank', () => {
    expect(query('A     B')).toEqual(query('A B'))
  })

  it('query priority', () => {
    expect(query('A03 A04')).toMatchInlineSnapshot(`
      Array [
        103,
        104,
      ]
    `)
    expect(query('A03 A04 A04')).toMatchInlineSnapshot(`
      Array [
        103,
        104,
      ]
    `)
  })
})
