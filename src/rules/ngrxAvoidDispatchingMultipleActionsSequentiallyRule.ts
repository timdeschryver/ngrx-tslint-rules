import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'It is recommended to only dispatch one action at a time',
    descriptionDetails:
      'See more at https://redux.js.org/style-guide/style-guide#avoid-dispatching-many-actions-sequentially',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-avoid-dispatching-multiple-actions-sequentially',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'Avoid dispatching many actions in a row to accomplish a larger conceptual "transaction"'

  private static STORE_DISPATCH_QUERY =
    'ExpressionStatement:has(CallExpression > PropertyAccessExpression:has(Identifier[name="dispatch"]):has(PropertyAccessExpression > Identifier[name="store"]))'
  // tslint:disable-next-line: member-ordering
  public static QUERY = `${Rule.STORE_DISPATCH_QUERY} ~ ${Rule.STORE_DISPATCH_QUERY}`

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
