import { createAction, props } from '@ngrx/store'

export const increment = createAction('increment')
export const increase = createAction('increase', props<{ value: number }>())
