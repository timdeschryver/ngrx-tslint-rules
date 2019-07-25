import { stripIndent } from '@angular-devkit/core/src/utils/literals'
import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import * as path from 'path'

it(`adds ngrx-tslint-rules to empty extends`, () => {
  const tslint = setup(`{}`)

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "ngrx-tslint-rules"
      ]
    }
    `)
})

it(`adds ngrx-tslint-rules to string extends`, () => {
  const tslint = setup(`{"extends": "tslint:latest"}`)

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "tslint:latest",
        "ngrx-tslint-rules"
      ]
    }
    `)
})

it(`adds ngrx-tslint-rules to array extends`, () => {
  const tslint = setup(`{"extends": ["tslint:latest"]}`)

  expect(tslint).toBe(stripIndent`
    {
      "extends": [
        "tslint:latest",
        "ngrx-tslint-rules"
      ]
    }
    `)
})

function setup(content: string) {
  const originalTree = new UnitTestTree(Tree.empty())
  originalTree.create('./tslint.json', content)

  const collectionPath = path.join(
    __dirname,
    '../../src/schematics/collection.json',
  )
  const schematicRunner = new SchematicTestRunner(
    'ngrx-tslint-rules',
    collectionPath,
  )

  const updatedTree = schematicRunner.runSchematic(`ng-add`, {}, originalTree)
  const tslintUpdated = updatedTree.readContent('./tslint.json')
  return tslintUpdated
}
