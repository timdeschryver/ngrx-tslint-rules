import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      'Using a selector in a select function is preferred in favor of strings/props drilling',
    descriptionDetails:
      'A selector is more performant, shareable and maintainable',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-selector-for-select',
    type: 'style',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'Using string or props drilling is not preferred, use a selector instead'

  private static STRING_LITERAL_QUERY = `CallExpression:has(PropertyAccessExpression > Identifier[name="pipe"]) > CallExpression > StringLiteral`
  private static PROP_DRILLING_QUERY = `CallExpression:has(PropertyAccessExpression > Identifier[name=pipe]) > CallExpression ArrowFunction`

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const stringHits = tsquery(sourceFile, Rule.STRING_LITERAL_QUERY)
    const propDrillHits = tsquery(sourceFile, Rule.PROP_DRILLING_QUERY)

    const failures = [...stringHits, ...propDrillHits].map(
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
