import {
  chain,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics'

import { Schema } from './schema'

export default function(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    return chain([extendTSLintRules(options.path || './tslint.json')])(
      host,
      context,
    )
  }
}

function extendTSLintRules(path: string) {
  return (tree: Tree) => {
    const tslint = tree.get(path)
    // tslint:disable-next-line: prefer-const
    let asJson = JSON.parse(tslint.content.toString())

    if (asJson === null || typeof asJson !== 'object') {
      throw new SchematicsException(`Error reading tslint file at ${path}`)
    }

    if (!asJson.extends) {
      asJson.extends = ['ngrx-tslint-rules']
    } else if (typeof asJson.extends === 'string') {
      asJson.extends = [asJson.extends, 'ngrx-tslint-rules']
    } else if ('length' in asJson.extends) {
      asJson.extends = [...asJson.extends, 'ngrx-tslint-rules']
    }

    tree.overwrite(path, JSON.stringify(asJson, null, 2))
    return tree
  }
}
