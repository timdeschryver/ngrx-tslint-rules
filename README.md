# ngrx-tslint-rules

> For the ESLint version of this library see, [eslint-plugin-ngrx](https://github.com/timdeschryver/eslint-plugin-ngrx)

## Installation

### Using the Angular CLI

Use the ng-add command from the Angular CLI to be guided with the installation.
We'll ask you for which rules you want to enable.

```bash
ng add ngrx-tslint-rules
```

### Manual install with npm or yarn

First install `ngrx-tslint-rules` as a dependency with the following command.

```bash
npm install ngrx-tslint-rules --save-dev
```

Next, add `ngrx-tslint-rules` to your `tslint.json` file, and the rules to the `rules` config.

```json
{
  "extends": ["ngrx-tslint-rules"],
  "rules": {
    ...
  }
}
```

To enable all rules, use the `recommended` configuration file.

```json
{
  "extends": ["ngrx-tslint-rules/recommended"]
}
```

## Rules

> By default all rules are enabled

| Rule                              | Description                                                                                                                    | Examples                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| ngrx-action-hygiene               | Enforces the use of good action hygiene                                                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/action-hygiene/fixture.ts.lint)                    |
| ngrx-effect-creator-and-decorator | An Effect should only use the effect creator (`createEffect`) or the Effect decorator (`@Effect`), but not both simultaneously | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-effect-creator-and-decorator/fixture.ts.lint) |
| ngrx-no-dispatch-in-effects       | An Effect should not call `store.dispatch`, but should return an action                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-dispatch-in-effects/fixture.ts.lint)       |
| ngrx-no-duplicate-action-types    | An action type must be unique                                                                                                  | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-duplicate-action-types/fixture.ts.lint)    |
| ngrx-no-typed-store               | A store should not be typed                                                                                                    | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-typed-store/fixture.ts.lint)               |
| ngrx-selector-for-select          | Using string or props drilling is not preferred, use a selector instead                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-selector-for-select/fixture.ts.lint)          |

## License

MIT
