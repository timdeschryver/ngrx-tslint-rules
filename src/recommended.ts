module.exports = {
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
  },
  rulesDirectory: './rules',
}
