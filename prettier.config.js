module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '{data,draft,stale}/*.json',
      options: { parser: 'json-stringify' },
    },
  ],
}
