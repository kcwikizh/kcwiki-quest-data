import fs from 'fs'
import path from 'path'
import ts from 'typescript'
import { trimStart } from 'lodash'

const getCompilerOptions = (): ts.CompilerOptions => {
  const maybeFile = ts.findConfigFile(path.resolve(), ts.sys.fileExists)
  if (maybeFile == undefined) {
    throw new Error('Cannot find tsconfig.json')
  }

  const { config, error } = ts.readConfigFile(maybeFile, (path: string) =>
    fs.readFileSync(path).toString(),
  )
  if (error != undefined) {
    const message = `TS${error.code}: ${error.file}:${error.start} ${error.messageText}`
    throw new Error(message)
  }

  const { options, errors } = ts.convertCompilerOptionsFromJson(
    config.compilerOptions,
    '',
  )

  if (errors.length) {
    const message = errors
      .map((e) => `TS${e.code}: ${e.file}:${e.start} ${e.messageText}`)
      .join('\n')
    throw new Error(message)
  }

  return options
}
const compilerOptions = getCompilerOptions()

const createQuestCompilerHost = (customizePath = '@/') => {
  const compilerHost = ts.createCompilerHost(compilerOptions)

  const getSourceFile = (
    fileName: string,
    languageVersion: ts.ScriptTarget,
    ...args: any[]
  ) => {
    const isCustomizeFile = fileName.startsWith(customizePath)
    if (!isCustomizeFile) {
      return compilerHost.getSourceFile(fileName, languageVersion, ...args)
    }

    const questName = trimStart(fileName, customizePath).split('.')[0]
    const prefix =
      "import { Quest } from '../types'; " + `const quest${questName}: Quest = `
    // const suffix = ' as const'
    return ts.createSourceFile(
      questName,
      prefix + ts.sys.readFile(path.resolve('data', questName + '.json')),
      languageVersion,
    )
  }
  const questCompilerHost = {
    ...compilerHost,
    getSourceFile,
  }
  return questCompilerHost
}

const parseDiagnostic = (diagnostics: readonly ts.Diagnostic[]) => {
  return diagnostics
    .map((diagnostic) => {
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start!,
        )
        let message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n',
        )
        return `${diagnostic.file!.fileName} (${line + 1},${
          character + 1
        }): ${message} ts(${diagnostic.code})`
      } else {
        return (
          ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n') +
          ` ts(${diagnostic.code})`
        )
      }
    })
    .join('\n')
}

describe('Validating quest ts type', () => {
  it(`quest match ts type`, () => {
    const questFile = fs.readdirSync(path.resolve('data')).map((f) => '@/' + f)
    const program = ts.createProgram(
      questFile,
      compilerOptions,
      createQuestCompilerHost(),
    )
    const diagnostics = ts.getPreEmitDiagnostics(program)
    if (diagnostics.length) {
      fail(parseDiagnostic(diagnostics))
    }
  })
})
