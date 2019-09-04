import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics'
import * as fs from 'fs'
import * as path from 'path'

import { Schema } from './schema'

export default function(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      extendTSLintRules(options.path || './tslint.json', options.rules),
    ])(host, context)
  }
}

function extendTSLintRules(filePath: string, selectedRules: string[]) {
  return (tree: Tree) => {
    const tslint = tree.get(filePath)
    let asJson = JSON.parse(tslint.content.toString())

    if (asJson === null || typeof asJson !== 'object') {
      throw new SchematicsException(`Error reading tslint file at ${filePath}`)
    }

    const recommendedOption = 'recommended'
    const recommended = selectedRules.includes(recommendedOption)

    const extendFrom = recommended
      ? 'ngrx-tslint-rules/recommended'
      : 'ngrx-tslint-rules'

    if (!asJson.extends) {
      asJson.extends = [extendFrom]
    } else if (typeof asJson.extends === 'string') {
      asJson.extends = [...new Set([asJson.extends, extendFrom])]
    } else if ('length' in asJson.extends) {
      asJson.extends = [...new Set([...asJson.extends, extendFrom])]
    }

    if (!recommended) {
      asJson.rules = asJson.rules || {}
      const configContent = fs.readFileSync(
        path.join(__dirname, 'rules-config.json'),
        'utf-8',
      )
      const rulesConfig = JSON.parse(configContent)

      const rulesToAdd = selectedRules
        .filter(p => p !== recommendedOption)
        .reduce((rules, name) => {
          const ruleInfo = rulesConfig[name]
          return {
            ...rules,
            [name]: {
              severity: `${
                ruleInfo.type === 'functionality' ? 'error' : 'warning'
              }`,
            },
          }
        }, {})

      asJson.rules = {
        ...asJson.rules,
        ...rulesToAdd,
      }
    }

    tree.overwrite(filePath, JSON.stringify(asJson, null, 2))
    return tree
  }
}
