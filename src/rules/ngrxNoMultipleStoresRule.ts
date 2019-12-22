import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'The should only be one story injected',
    descriptionDetails: 'There is only one global store',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: true,
    ruleName: 'ngrx-no-multiple-stores',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING = 'Store should at most be one time injected'
  private CONSTRUCTOR_QUERY = `ClassDeclaration > Constructor`
  private PARAMETER_QUERY = `Parameter > TypeReference > Identifier[name="Store"]`

  public applyWithProgram(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const constructors = tsquery(sourceFile, this.CONSTRUCTOR_QUERY)
    const failures = constructors
      .map(ctor => tsquery(ctor, this.PARAMETER_QUERY))
      .reduce(
        (hits, parameters) => {
          if (parameters.length <= 1) {
            return hits
          }
          const { parent: typeRefNode } = parameters.pop()
          const { parent: parameterNode } = typeRefNode
          const failure = new Lint.RuleFailure(
            sourceFile,
            parameterNode.getStart(),
            parameterNode.getStart() + parameterNode.getWidth(),
            Rule.FAILURE_STRING,
            this.ruleName,
          )
          return [...hits, failure]
        },
        [] as Lint.RuleFailure[],
      )

    return failures
  }
}
