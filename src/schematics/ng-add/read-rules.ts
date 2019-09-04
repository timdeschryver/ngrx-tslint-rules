import { tsquery } from '@phenomnomnominal/tsquery'
import * as fs from 'fs'
import * as path from 'path'
import * as Lint from 'tslint'
import ts = require('typescript')

export function readRules(directory: string) {
  const rules = fs.readdirSync(directory).reduce((rulesConfigs, file) => {
    const filePath = path.join(directory, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    const [ruleConfigNode] = tsquery(
      content,
      'ClassDeclaration > PropertyDeclaration:has(StaticKeyword):has(PublicKeyword):first-child > ObjectLiteralExpression',
    ) as ts.ObjectLiteralExpression[]
    if (ruleConfigNode) {
      const ruleConfig = ruleConfigNode.properties.reduce(
        (config, prop: ts.PropertyAssignment) => {
          config[prop.name.getText()] = ts.isStringLiteral(prop.initializer)
            ? prop.initializer.text
            : prop.initializer.getText()
          return config
        },
        ({} as unknown) as Lint.IRuleMetadata,
      )

      rulesConfigs[ruleConfig.ruleName] = {
        description: ruleConfig.description,
        severity: ruleConfig.type === 'functionality' ? 'error' : 'warning',
      }

      return rulesConfigs
    }
  }, {})

  return rules as any
}
