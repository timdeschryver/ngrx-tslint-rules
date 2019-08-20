# ngrx-tslint-rules

## Installation

### Using the Angular CLI

If your project is using the Angular CLI then you can install `ngrx-tslint-rules` to your project with the following ng add command

```bash
ng add ngrx-tslint-rules
```

### Manual install with npm or yarn

First install `ngrx-tslint-rules` as a dependency with the following command

```bash
npm install ngrx-tslint-rules --save-dev
```

Next, add `ngrx-tslint-rules` to your `tslint.json` file

```json
{
  "extends": ["ngrx-tslint-rules"],
  "rules": {
    ...
  }
}
```

## Rules

> By default all rules are enabled

| Rule                              | Description                                                                                                                    | Examples                                                                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| ngrx-action-hygiene               | Enforces the use of good action hygiene                                                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/action-hygiene/fixture.ts.lint)                    |
| ngrx-effect-creator-and-decorator | An Effect should only use the effect creator (`createEffect`) or the Effect decorator (`@Effect`), but not both simultaneously | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-effect-creator-and-decorator/fixture.ts.lint) |
| ngrx-no-duplicate-action-types    | An action type must be unique                                                                                                  | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-no-duplicate-action-types/fixture.ts.lint)    |
| ngrx-selector-for-select          | Using string or props drilling is not preferred, use a selector instead                                                        | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-selector-for-select/fixture.ts.lint)          |
| ngrx-unique-reducer-actions       | An action can't be handled multiple times in the same reducer                                                                  | [Example](https://github.com/timdeschryver/ngrx-tslint-rules/tree/master/test/rules/ngrx-unique-reducer-actions/fixture.ts.lint)       |

## License

MIT
