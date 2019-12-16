import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'The createEffect creator function is preferred',
    descriptionDetails: 'createEffect allows an effect to be type safe',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-use-create-effect',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'The createEffect creator function is preferred'

  private static QUERY = `ClassDeclaration Decorator > CallExpression:has(Identifier[name="Effect"])`

  public applyWithProgram(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const hits = tsquery(sourceFile, Rule.QUERY)

    const failures = hits.map(
      (node): Lint.RuleFailure =>
        new Lint.RuleFailure(
          sourceFile,
          node.getStart() - 1,
          node.getStart() + node.getWidth(),
          Rule.FAILURE_STRING,
          this.ruleName,
        ),
    )

    return failures
  }
}
