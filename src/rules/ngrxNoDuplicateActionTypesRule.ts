import { tsquery } from '@phenomnomnominal/tsquery'
import * as path from 'path'
import * as Lint from 'tslint'
import * as ts from 'typescript'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'An action type must be unique',
    descriptionDetails: 'Based on the action type ',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-no-duplicate-action-types',
    type: 'maintainability',
    typescriptOnly: true,
  }

  public static FAILURE_STRING_SAME_FILE =
    'An action type must be unique. Duplicate action type {ACTION-TYPE}.'
  public static FAILURE_STRING_DIFFERENT_FILE =
    'An action type must be unique. Duplicate action type {ACTION-TYPE} in files {SOURCE-FILE} and {COMPARE-FILE}.'

  public applyWithProgram(
    sourceFile: ts.SourceFile,
    program: ts.Program,
  ): Lint.RuleFailure[] {
    const sourceActionTypeNodes = this.getActionTypeNodes(sourceFile)
    if (sourceActionTypeNodes.length === 0) {
      return []
    }

    const sourceFileFailures = this.findDuplicates(
      sourceFile,
      sourceActionTypeNodes,
    )
    const sourceActionTypes = sourceActionTypeNodes.map(node => node.getText())

    const compareFiles = program
      .getSourceFiles()
      .filter(
        ({ fileName: compareFileName }) =>
          compareFileName !== sourceFile.fileName &&
          compareFileName.endsWith('.ts') &&
          !compareFileName.includes('.d.ts'),
      )

    const compareFileFailures = compareFiles.map(
      ({ fileName: compareFileName }) => {
        const compareFile = program.getSourceFile(compareFileName)
        if (!compareFile) {
          return []
        }
        const compareActionTypeNodes = this.getActionTypeNodes(compareFile)

        // only check on same action types as in the source file
        const impactedActionTypes = compareActionTypeNodes.filter(node =>
          sourceActionTypes.includes(node.getText()),
        )

        return this.findDuplicates(
          sourceFile,
          impactedActionTypes.concat(sourceActionTypeNodes),
          compareFileName,
        )
      },
    )

    const failures = ([] as Lint.RuleFailure[]).concat(
      ...sourceFileFailures,
      ...compareFileFailures,
    )

    const unduppedFailures = failures.reduce<Lint.RuleFailure[]>(
      (undupped, failure) => {
        if (undupped.some(u => Lint.RuleFailure.compare(u, failure) === 0)) {
          return undupped
        }

        return [...undupped, failure]
      },
      [],
    )

    return unduppedFailures
  }

  private getActionTypeNodes(sourceFile: ts.SourceFile): ts.Node[] {
    const actionTypeNodes = tsquery(
      sourceFile,
      `CallExpression:has(Identifier[name=/createAction.*/]) > StringLiteral`,
    )
    return actionTypeNodes
  }

  private findDuplicates(
    sourceFile: ts.SourceFile,
    actionTypeNodes: ts.Node[],
    compareFileName: string = '',
  ) {
    const actionTypeCounter = actionTypeNodes.reduce<Record<string, ts.Node[]>>(
      (counter, typeNode): Record<string, ts.Node[]> => {
        const actionType = typeNode.getText()
        return {
          ...counter,
          [actionType]: (counter[actionType] || []).concat(typeNode),
        }
      },
      {},
    )

    const duplicates = Object.entries(actionTypeCounter)
      .filter(([_, nodes]): boolean => nodes.length > 1)
      .map(([actionType, nodes]): [string, ts.Node[]] => [
        actionType,
        nodes.slice(1),
      ])

    const actionTypeFailures = duplicates.map(
      ([actionType, nodes]): Lint.RuleFailure[] => {
        const failureMessage = compareFileName
          ? Rule.FAILURE_STRING_DIFFERENT_FILE.replace(
              '{ACTION-TYPE}',
              actionType,
            )
              .replace('{SOURCE-FILE}', path.basename(sourceFile.fileName))
              .replace('{COMPARE-FILE}', path.basename(compareFileName))
          : Rule.FAILURE_STRING_SAME_FILE.replace('{ACTION-TYPE}', actionType)
        return nodes.map(
          (node): Lint.RuleFailure =>
            new Lint.RuleFailure(
              sourceFile,
              node.getStart(),
              node.getStart() + node.getWidth(),
              failureMessage,
              this.ruleName,
            ),
        )
      },
    )

    return ([] as Lint.RuleFailure[]).concat(...actionTypeFailures)
  }
}
