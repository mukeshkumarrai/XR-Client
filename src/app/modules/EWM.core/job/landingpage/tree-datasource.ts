import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { MatTreeNestedDataSource, MatTree } from "@angular/material/tree";

/**
 * workflow data with nested structure.
 * Each node has a StageName and an optional list of Stages.
 */
export interface TreeNode {
  StageName: string;
  ColorCode: string;
  Stages?: TreeNode[];
}

export class TreeDataSource extends MatTreeNestedDataSource<TreeNode> {
  constructor(
    private treeControl: NestedTreeControl<TreeNode>,
    intialData: TreeNode[]
  ) {
    super();
    this._data.next(intialData);
  }


  /*
   * For immutable update patterns, have a look at:
   * https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns/
   */

  protected _add(newNode: TreeNode, parent: TreeNode, tree: TreeNode) {
    if (tree === parent) {
      // console.log(
      //   `replacing Stages array of '${parent.StageName}', adding ${newNode.StageName}`
      // );
      tree.Stages = [...tree.Stages!, newNode];
      this.treeControl.expand(tree);
      return true;
    }
    if (!tree.Stages) {
      //console.log(`reached leaf node '${tree.StageName}', backing out`);
      return false;
    }
    return this.update(tree, this._add.bind(this, newNode, parent));
  }

  _remove(node: TreeNode, tree: TreeNode): boolean {
    if (!tree.Stages) {
      return false;
    }
    const i = tree.Stages.indexOf(node);
    if (i > -1) {
      tree.Stages = [
        ...tree.Stages.slice(0, i),
        ...tree.Stages.slice(i + 1)
      ];
      this.treeControl.collapse(node);
      //console.log(`found ${node.StageName}, removing it from`, tree);
      return true;
    }
    return this.update(tree, this._remove.bind(this, node));
  }

  protected update(tree: TreeNode, predicate: (n: TreeNode) => boolean) {
    let updatedTree: TreeNode, updatedIndex: number;

    tree.Stages!.find((node, i) => {
      if (predicate(node)) {
       // console.log(`creating new node for '${node.StageName}'`);
        updatedTree = { ...node };
        updatedIndex = i;
        this.moveExpansionState(node, updatedTree);
        return true;
      }
      return false;
    });

    if (updatedTree!) {
      //console.log(`replacing node '${tree.Stages![updatedIndex!].StageName}'`);
      tree.Stages![updatedIndex!] = updatedTree!;
      return true;
    }
    return false;
  }

  moveExpansionState(from: TreeNode, to: TreeNode) {
    if (this.treeControl.isExpanded(from)) {
      //console.log(`'${from.StageName}' was expanded, setting expanded on new node`);
      this.treeControl.collapse(from);
      this.treeControl.expand(to);
    }
  }
}