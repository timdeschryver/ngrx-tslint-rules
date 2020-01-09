const queryNgModuleProperty = (property: string) =>
  `${NG_MODULE_QUERY} > ObjectLiteralExpression PropertyAssignment[name.text="${property}"] > ArrayLiteralExpression`

export const NG_MODULE_QUERY =
  'ClassDeclaration > Decorator > CallExpression[expression.text="NgModule"]'
export const NG_MODULE_IMPORTS = queryNgModuleProperty('imports')
export const NG_MODULE_PROVIDERS = queryNgModuleProperty('providers')
