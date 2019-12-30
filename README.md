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

> The recommended rules also export the rules from [rxjs-tslint-rules](https://github.com/cartant/rxjs-tslint-rules) that can be applied to NgRx

## Rules

> By default all rules are enabled

| Rule                                                 | Description                                                                                                                    | Examples                                                                                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ngrx-action-hygiene                                  | Enforces the use of good action hygiene                                                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-action-hygiene/fixture.ts.lint)                                  |
| ngrx-avoid-dispatching-multiple-actions-sequentially | It is recommended to only dispatch one action at a time                                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-avoid-dispatching-multiple-actions-sequentially/fixture.ts.lint) |
| ngrx-effect-creator-and-decorator                    | An Effect should only use the effect creator (`createEffect`) or the Effect decorator (`@Effect`), but not both simultaneously | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-effect-creator-and-decorator/fixture.ts.lint)                    |
| ngrx-no-dispatch-in-effects                          | An Effect should not call `store.dispatch`, but should return an action                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-dispatch-in-effects/fixture.ts.lint)                          |
| ngrx-no-duplicate-action-types                       | An action type must be unique                                                                                                  | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-duplicate-action-types/fixture.ts.lint)                       |
| ngrx-no-effect-decorator                             | The createEffect creator function is preferred                                                                                 | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-effect-decorator/fixture.ts.lint)                             |
| ngrx-no-multiple-actions-in-effects                  | An Effect should not return multiple actions                                                                                   | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-multiple-actions-in-effects/fixture.ts.lint)                  |
| ngrx-no-multiple-stores                              | Store should at most be one time injected                                                                                      | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-multiple-stores/fixture.ts.lint)                              |
| ngrx-no-reducer-in-key-names                         | Avoid the word "reducer" in the key names                                                                                      | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-reducer-in-key-names/fixture.ts.lint)                         |
| ngrx-no-typed-store                                  | A store should not be typed                                                                                                    | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-typed-store/fixture.ts.lint)                                  |
| ngrx-selector-for-select                             | Using string or props drilling is not preferred, use a selector instead                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-selector-for-select/fixture.ts.lint)                             |

## License

MIT
