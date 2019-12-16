module.exports = {
  rules: {
    'ngrx-action-hygiene': 'warning',
    'ngrx-avoid-dispatching-multiple-actions-sequentially': 'warning',
    'ngrx-effect-creator-and-decorator': 'error',
    'ngrx-no-dispatch-in-effects': 'error',
    'ngrx-no-duplicate-action-types': 'error',
    'ngrx-no-typed-store': 'error',
    'ngrx-selector-for-select': 'error',
  },
  rulesDirectory: './rules',
}
