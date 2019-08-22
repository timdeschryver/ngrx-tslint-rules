import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description:
      "An action can't be handled multiple times in the same reducer",
    descriptionDetails: 'See more at https://ngrx.io/api/store/on',
    options: null,
    optionsDescription: 'Not configurable',
    rationale:
      'Only the last defined `on` function will be used to handle the action',
    requiresTypeInfo: false,
    ruleName: 'ngrx-unique-reducers-action',
    type: 'functionality',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'The actions within a reducer must be unique. Duplicate action {ACTION-NAME}.'

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const reducers = tsquery(
      sourceFile,
      `CallExpression:has(Identifier[name=createReducer])`,
    )

    const duplicatesInReducer = reducers.map((reducer): Lint.RuleFailure[] => {
      const onNodes = tsquery(
        reducer,
        `CallExpression > CallExpression`,
      ) as ts.CallExpression[]
      const actionNodes = onNodes
        .filter(node => node.arguments && node.arguments.length > 1)
        .map(node => node.arguments[0])

      const actionCounter = actionNodes.reduce<Record<string, ts.Node[]>>(
        (counter, actionNode): Record<string, ts.Node[]> => {
          const actionName = actionNode.getText()
          return {
            ...counter,
            [actionName]: (counter[actionName] || []).concat(actionNode),
          }
        },
        {},
      )

      const duplicates = Object.entries(actionCounter)
        .filter(([_, nodes]): boolean => nodes.length > 1)
        .map(([actionName, nodes]): [string, ts.Node[]] => [
          actionName,
          nodes.slice(1),
        ])

      const reducerFailures = duplicates.map(
        ([actionName, nodes]): Lint.RuleFailure[] => {
          return nodes.map(
            (node): Lint.RuleFailure =>
              new Lint.RuleFailure(
                sourceFile,
                node.getStart(),
                node.getStart() + node.getWidth(),
                Rule.FAILURE_STRING.replace('{ACTION-NAME}', actionName),
                this.ruleName,
              ),
          )
        },
      )

      return ([] as Lint.RuleFailure[]).concat(...reducerFailures)
    })

    return ([] as Lint.RuleFailure[]).concat(...duplicatesInReducer)
  }
}
