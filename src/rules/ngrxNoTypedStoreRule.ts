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
    'Store should not be typed, use `Store` (without generic) instead'

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const storeNodes = tsquery(
      sourceFile,
      `ClassDeclaration > Constructor Parameter > TypeReference[typeName.text="Store"]`,
    ) as ts.TypeReferenceNode[]

    const hits = storeNodes
      .filter(n => n.typeArguments && n.typeArguments.length)
      .map(n => n.typeArguments[0])

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
