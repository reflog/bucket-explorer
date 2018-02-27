"use strict";
import * as vscode from "vscode";
import { BucketTreeDataProvider} from "./bucketExplorer";
import {TreeNode} from "./nodes/treeNode";

export function activate(context: vscode.ExtensionContext) {
  const bucketExplorerProvider = new BucketTreeDataProvider(context);
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      "bucketExplorer",
      bucketExplorerProvider
    )
  );
  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      "bucket",
      bucketExplorerProvider
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("openBucketResource", (node: TreeNode) => {
      vscode.workspace.openTextDocument(node.resource).then(
        document => {
          vscode.window.showTextDocument(document);
        },
        error => vscode.window.showErrorMessage(error.message)
      );
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("bucketExplorerRefresh", () =>
      bucketExplorerProvider.refresh()
    )
  );
}

export function deactivate() {}
