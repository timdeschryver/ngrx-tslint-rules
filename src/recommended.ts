module.exports = {
  extends: ['rxjs-tslint-rules'],
  rules: {
    'ngrx-action-hygiene': {
      severity: 'warning',
    },
    'ngrx-avoid-dispatching-multiple-actions-sequentially': {
      severity: 'warning',
    },
    'ngrx-effect-creator-and-decorator': {
      severity: 'error',
    },
    'ngrx-no-dispatch-in-effects': {
      severity: 'warning',
    },
    'ngrx-no-duplicate-action-types': {
      severity: 'error',
    },
    'ngrx-no-typed-store': {
      severity: 'warning',
    },
    'ngrx-selector-for-select': {
      severity: 'error',
    },
    'ngrx-use-create-effect': {
      severity: 'warning',
    },
    // re-export from rxjs-tslint-rules
    'rxjs-no-unsafe-catch': { severity: 'error' },
    'rxjs-no-unsafe-first': { severity: 'error' },
    'rxjs-no-unsafe-switchmap': { severity: 'error' },
  },
  rulesDirectory: './rules',
}
