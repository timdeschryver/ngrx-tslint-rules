import { tsquery } from '@phenomnomnominal/tsquery'
import * as fs from 'fs'
import * as path from 'path'
import * as Lint from 'tslint'
import ts = require('typescript')

const rulesConfig = readRules('./src/rules')

const schema = fs.readFileSync(
  path.join(__dirname, '../schematics/ng-add/schema.json'),
  'utf-8',
)
const generatedSchema = JSON.parse(schema)
generatedSchema.properties.rules['x-prompt'].items = [
  ...generatedSchema.properties.rules['x-prompt'].items,
  ...Object.entries(rulesConfig).map(([key, value]: [string, any]) => ({
    label: `${key} (${value.description})`,
    value: key,
  })),
]

fs.writeFileSync(
  path.join(__dirname, '../../dist/schematics/ng-add/rules-config.json'),
  JSON.stringify(rulesConfig, null, 2),
  'utf-8',
)

fs.writeFileSync(
  path.join(__dirname, '../../dist/schematics/ng-add/schema.json'),
  JSON.stringify(generatedSchema, null, 2),
  'utf-8',
)

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

      rulesConfigs[ruleConfig.ruleName] = ruleConfig

      return rulesConfigs
    }
  }, {})

  return rules as { [ruleName: string]: Lint.IRuleMetadata }
}
