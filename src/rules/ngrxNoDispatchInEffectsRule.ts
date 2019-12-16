import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'An Effect should not call store.dispatch',
    descriptionDetails: 'An action should be returned from the effect',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-no-dispatch-in-effects',
    type: 'functionality',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'Calling `store.dispatch` in an Effect is forbidden'

  private static QUERY = `PropertyDeclaration > CallExpression:has(Identifier[name="createEffect"]) CallExpression > PropertyAccessExpression:has(Identifier[name="dispatch"]):has(PropertyAccessExpression > Identifier[name="store"])`

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const hits = tsquery(sourceFile, Rule.QUERY)

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
