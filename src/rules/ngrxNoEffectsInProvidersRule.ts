import { tsquery } from '@phenomnomnominal/tsquery'
import * as Lint from 'tslint'
import * as ts from 'typescript'
import { NG_MODULE_IMPORTS, NG_MODULE_PROVIDERS } from '../utils/queries'

export class Rule extends Lint.Rules.TypedRule {
  public static metadata: Lint.IRuleMetadata = {
    description: 'The Effect should not be listed as a provider',
    descriptionDetails:
      'If an Effect is registered to the EffectsModule and is added as a provider, it will be registered twice',
    options: null,
    optionsDescription: 'Not configurable',
    requiresTypeInfo: false,
    ruleName: 'ngrx-no-effects-in-providers',
    type: 'functionality',
    typescriptOnly: true,
  }

  public static FAILURE_STRING =
    'The Effect should not be listed as a provider if it is added to the EffectsModule'

  private static QUERY = `${NG_MODULE_IMPORTS} > CallExpression[expression.expression.text="EffectsModule"][expression.name.text=/forFeature|forRoot/] > ArrayLiteralExpression > Identifier`

  public applyWithProgram(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const effectIdentifierNodes = tsquery(
      sourceFile,
      Rule.QUERY,
    ) as ts.Identifier[]

    const effectNames = effectIdentifierNodes.map(node => node.text).join('|')
    const hits = tsquery(
      sourceFile,
      `${NG_MODULE_PROVIDERS} > Identifier[name=/${effectNames}/]`,
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
