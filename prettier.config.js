module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '{data,draft,outdated}/*.json',
      options: { parser: 'json-stringify' },
    },
  ],
}
