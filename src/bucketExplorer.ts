import {
    CancellationToken,
    commands,
    ConfigurationChangeEvent,
    Event,
    EventEmitter,
    ExtensionContext,
    ProviderResult,
    TextDocumentContentProvider,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    Uri,
    workspace
} from "vscode";
import {AccountTreeNode} from "./nodes/accountNode";
import {FolderTreeNode} from "./nodes/folderNode";
import {TreeNode} from "./nodes/treeNode";


export class BucketTreeDataProvider
  implements TreeDataProvider<TreeNode>, TextDocumentContentProvider {
  private _onDidChangeTreeData = new EventEmitter<TreeNode>();
  public get onDidChangeTreeData(): Event<TreeNode> {
    return this._onDidChangeTreeData.event;
  }
  private accounts: AccountTreeNode[] = [];

  processConfig() {
    const conf = workspace.getConfiguration("bucketExplorer");
    const enabled = conf.get("enabled", true);
    commands.executeCommand("setContext", "bucketExplorer:enabled", enabled);
    this.accounts = conf.get("buckets", []).map(b => {
      return new AccountTreeNode(
        `${b.provider}/${b.name}`,
        b.provider,
        b.configuration,
        b.name
      );
    });
    this._onDidChangeTreeData.fire();
  }

  startOnConfigurationChangeWatcher() {
    return workspace.onDidChangeConfiguration(
      (params: ConfigurationChangeEvent) => {
        if (params.affectsConfiguration("bucketExplorer")) this.processConfig();
      }
    );
  }
  constructor(context: ExtensionContext) {
    context.subscriptions.push(this.startOnConfigurationChangeWatcher());
    this.processConfig();
  }

  public getTreeItem(element: TreeNode): TreeItem {
    return {
      label: element.name,
      resourceUri: element.resource,
      collapsibleState:
        element instanceof FolderTreeNode
          ? TreeItemCollapsibleState.Collapsed
          : TreeItemCollapsibleState.None,
      command:
        element instanceof FolderTreeNode
          ? void 0
          : {
              command: "openBucketResource",
              arguments: [element],
              title: "Open Bucket Item"
            }
    };
  }

  public nodeByUri(uri: Uri): TreeNode | undefined {
    for (let i = 0; i < this.accounts.length; i++) {
      const node = this.accounts[i].nodeByUri(uri);
      if (node) return node;
    }
    return undefined;
  }

  public refresh() {
    for (let i = 0; i < this.accounts.length; i++) {
      this.accounts[i].children = null;
    }
    this._onDidChangeTreeData.fire();
  }

  public getChildren(element?: TreeNode): TreeNode[] | Thenable<TreeNode[]> {
    return !element ? TreeNode.sortedNodes(this.accounts) : element.getChildren();
  }

  public provideTextDocumentContent(
    uri: Uri,
    token: CancellationToken
  ): ProviderResult<string> {
    const node = this.nodeByUri(uri);
    return node.account.getContent(uri);
  }
}
