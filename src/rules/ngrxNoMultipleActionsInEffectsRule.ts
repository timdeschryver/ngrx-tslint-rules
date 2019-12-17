import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import { couldBeType } from 'tsutils-etc'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'An Effect should not return multiple actions',
    descriptionDetails: 'An Effect should only return one action',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: true,
    ruleName: 'ngrx-no-multiple-actions-in-effects',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING = 'An Effect should not return multiple actions'
  private EFFECTS_OPERATORS_QUERY = `ClassDeclaration > PropertyDeclaration > CallExpression:has(Identifier[name="createEffect"]) CallExpression:has(Identifier[name=/(switchMap|concatMap|mergeMap|flatMap|exhaustMap)/])`

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const arrayAsReturnStatementHits = tsquery(
      sourceFile,
      `${this.EFFECTS_OPERATORS_QUERY} ReturnStatement > ArrayLiteralExpression`,
    )
    const arrayShorthandStatementHits = tsquery(
      sourceFile,
      `${this.EFFECTS_OPERATORS_QUERY} > ArrowFunction > ArrayLiteralExpression`,
    )
    const hits = [...arrayAsReturnStatementHits, ...arrayShorthandStatementHits]

    if (!hits.length) {
      return []
    }

    const typeChecker = program.getTypeChecker()
    const failures = hits
      .map((node): Lint.RuleFailure | null => {
        const { typeArguments } = (typeChecker.getTypeAtLocation(
          node,
        ) as unknown) as ts.NodeWithTypeArguments

        const returnsMultipleActions =
          typeArguments &&
          typeArguments.some(
            (args: NodeWithTypes) =>
              args.types &&
              args.types.some(type => couldBeType(type, 'Action')),
          )

        if (returnsMultipleActions) {
          return new Lint.RuleFailure(
            sourceFile,
            node.getStart(),
            node.getStart() + node.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName,
          )
        }

        return null
      })
      .filter(Boolean)

    return failures
  }
}

interface NodeWithTypes extends ts.TypeNode {
  types?: ts.Type[]
}
