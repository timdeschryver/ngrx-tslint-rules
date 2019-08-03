import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      'An Effect should only use the effect creator (`createEffect`) or the Effect decorator (`@Effect`), but not both simultaneously',
    descriptionDetails:
      'The Effect will fire twice when using both the creator function, as the decorator',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-effect-creator-and-decorator',
    type: 'functionality',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'Remove the `@Effect` decorator or the `createEffect` creator'

  private static QUERY = `PropertyDeclaration:has(Decorator > CallExpression > Identifier[name="Effect"]):has(CallExpression > Identifier[name="createEffect"]) > Identifier`

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
