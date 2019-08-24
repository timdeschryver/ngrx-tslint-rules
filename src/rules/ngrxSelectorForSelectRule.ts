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

  private static SELECT_QUERY = `CallExpression:has(PropertyAccessExpression > Identifier[name="pipe"]) > CallExpression:has(Identifier[name="select"])`

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const selectNodes = tsquery(
      sourceFile,
      Rule.SELECT_QUERY,
    ) as ts.CallExpression[]

    const args = selectNodes.reduce(
      (result, selectNode) => [...result, ...selectNode.arguments],
      [] as ts.Node[],
    )

    const failures = args.filter(
      node => ts.isStringLiteral(node) || ts.isArrowFunction(node),
    )

    return failures.map(
      (node): Lint.RuleFailure =>
        new Lint.RuleFailure(
          sourceFile,
          node.getStart(),
          node.getStart() + node.getWidth(),
          Rule.FAILURE_STRING,
          this.ruleName,
        ),
    )
  }
}
