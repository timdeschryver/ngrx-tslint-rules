import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'Avoid the word "reducer" in the key names',
    descriptionDetails:
      'See more at https://redux.js.org/style-guide/style-guide/#name-state-slices-based-on-the-stored-data',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-no-reducer-in-key-names',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'Avoid the word "reducer" in the key names to result in better understandable code and state definition'

  public static STORE_MODULE_QUERY = `CallExpression[expression.expression.name="StoreModule"] > ObjectLiteralExpression`
  public static ACTION_REDUCER_MAP_QUERY = `VariableStatement > VariableDeclarationList VariableDeclaration[type.typeName.name="ActionReducerMap"] > ObjectLiteralExpression`

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const storeModuleReducerNodes = tsquery(sourceFile, Rule.STORE_MODULE_QUERY)
    const actionMapReducerNodes = tsquery(
      sourceFile,
      Rule.ACTION_REDUCER_MAP_QUERY,
    )
    const hits = [...storeModuleReducerNodes, ...actionMapReducerNodes]
      .map(node => {
        if (ts.isObjectLiteralExpression(node)) {
          return node.properties
            .filter(
              prop =>
                (ts.isShorthandPropertyAssignment(prop) ||
                  ts.isPropertyAssignment(prop)) &&
                ts.isIdentifier(prop.name) &&
                prop.name.text.toLowerCase().endsWith('reducer'),
            )
            .map(prop => prop.name)
        }
        return []
      })
      .reduce((result, nodes) => [...result, ...nodes], [])

    const failures = hits.map(
      (node): Lint.RuleFailure =>
        new Lint.RuleFailure(
          sourceFile,
          node.getStart(),
          node.getStart() + node.getWidth(),
          Rule.FAILURE_STRING,
          this.ruleName,
        ),
    )

    return failures
  }
}
