import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'Store should not be typed',
    descriptionDetails:
      'This rule forces the usage of selectors, which are typed',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-no-typed-store',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'Store should not be typed, for v8 use `Store<object>` instead, for v9 use `Store`'

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const parameters = tsquery(
      sourceFile,
      `ClassDeclaration > Constructor Parameter > TypeReference[typeName.text="Store"] TypeReference`,
    ) as ts.TypeReferenceNode[]

    const hits = parameters.filter(
      type =>
        type.typeName &&
        ts.isIdentifier(type.typeName) &&
        type.typeName.text !== '{}' &&
        type.typeName.text !== 'object',
    )

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
