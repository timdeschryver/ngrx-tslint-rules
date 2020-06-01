import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'On reducer should have an explicit return type',
    descriptionDetails:
      'This rule forces the on reducer to have an explicit return type when defined with an arrow function.',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-on-reducer-explicit-return-type',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'On reducers should have an explicit return type when using arrow functions, on(action, (state):State => {}'

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const creators = tsquery(
      sourceFile,
      'CallExpression:has(Identifier[name=createReducer])  CallExpression:has(Identifier[name=on]) > ArrowFunction:not(:has(TypeReference),:has(CallExpression))',
    ) as ts.CallExpression[]

    const failures = creators.map(
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
