import { stripIndent } from '@angular-devkit/core/src/utils/literals'
import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

it(`adds ngrx-tslint-rules to empty extends`, () => {
  const tslint = setup(`{}`, ['recommended'])

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "ngrx-tslint-rules/recommended"
      ]
    }
    `)
})

it(`adds ngrx-tslint-rules to string extends`, () => {
  const tslint = setup(`{"extends": "tslint:latest"}`, ['recommended'])

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "tslint:latest",
        "ngrx-tslint-rules/recommended"
      ]
    }
    `)
})

it(`adds ngrx-tslint-rules to array extends`, () => {
  const tslint = setup(
    `{"extends": ["tslint:latest", "ngrx-tslint-rules/recommended"]}`,
    ['recommended'],
  )

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "tslint:latest",
        "ngrx-tslint-rules/recommended"
      ]
    }
    `)
})

it(`the recommended config has priority over rules`, () => {
  const tslint = setup(`{}`, [
    'recommended',
    'ngrx-action-hygiene',
    'ngrx-no-duplicate-action-types',
  ])

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "ngrx-tslint-rules/recommended"
      ]
    }
    `)
})

it(`adds the given rules to an empty config`, () => {
  const tslint = setup(`{}`, [
    'ngrx-action-hygiene',
    'ngrx-no-duplicate-action-types',
  ])

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "ngrx-tslint-rules"
      ],
      "rules": {
        "ngrx-action-hygiene": {
          "severity": "warning"
        },
        "ngrx-no-duplicate-action-types": {
          "severity": "error"
        }
      }
    }
    `)
})

it(`adds the given rules to the existing config`, () => {
  const tslint = setup(`{"rules": {"foo": true, "bar": false}}`, [
    'ngrx-action-hygiene',
    'ngrx-no-duplicate-action-types',
  ])

  expect(tslint).toBe(stripIndent`
    {
      "rules": {
        "foo": true,
        "bar": false,
        "ngrx-action-hygiene": {
          "severity": "warning"
        },
        "ngrx-no-duplicate-action-types": {
          "severity": "error"
        }
      },
      "extends": [
        "ngrx-tslint-rules"
      ]
    }
    `)
})

function setup(content: string, rules: string[]) {
  const originalTree = new UnitTestTree(Tree.empty())
  originalTree.create('./tslint.json', content)

  const collectionPath = path.join(
    __dirname,
    '../../dist/schematics/collection.json',
  )
  const schematicRunner = new SchematicTestRunner(
    'ngrx-tslint-rules',
    collectionPath,
  )

  const updatedTree = schematicRunner.runSchematic(
    `ng-add`,
    {
      rules,
    },
    originalTree,
  )
  const tslintUpdated = updatedTree.readContent('./tslint.json')
  return tslintUpdated
}
