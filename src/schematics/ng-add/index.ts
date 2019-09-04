import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics'
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks'

import { Schema } from './schema'

export default function(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([
      updateDependencies(),
      extendTSLintRules(options.path || './tslint.json', options.rules),
    ])(host, context)
  }
}

function updateDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask())
    return tree
  }
}

function extendTSLintRules(path: string, selectedRules: string[]) {
  return (tree: Tree) => {
    const tslint = tree.get(path)
    let asJson = JSON.parse(tslint.content.toString())

    if (asJson === null || typeof asJson !== 'object') {
      throw new SchematicsException(`Error reading tslint file at ${path}`)
    }

    const recommendedOption = 'recommended'
    const recommended = selectedRules.includes(recommendedOption)

    const extendFrom = recommended
      ? 'ngrx-tslint-rules/recommended'
      : 'ngrx-tslint-rules'

    if (!asJson.extends) {
      asJson.extends = [extendFrom]
    } else if (typeof asJson.extends === 'string') {
      asJson.extends = [asJson.extends, extendFrom]
    } else if ('length' in asJson.extends) {
      asJson.extends = [...asJson.extends, extendFrom]
    }

    const rulesSeverity = {
      'ngrx-action-hygiene': {
        severity: 'warning',
      },
      'ngrx-effect-creator-and-decorator': {
        severity: 'error',
      },
      'ngrx-no-duplicate-action-types': {
        severity: 'error',
      },
      'ngrx-selector-for-select': {
        severity: 'warning',
      },
      'ngrx-unique-reducer-actions': {
        severity: 'error',
      },
    }

    if (!recommended) {
      asJson.rules = asJson.rules || {}
      const rulesToAdd = selectedRules
        .filter(p => p !== recommendedOption)
        .reduce(
          (rules, name) => ({ ...rules, [name]: rulesSeverity[name] }),
          {},
        )

      asJson.rules = {
        ...asJson.rules,
        ...rulesToAdd,
      }
    }

    tree.overwrite(path, JSON.stringify(asJson, null, 2))
    return tree
  }
}
