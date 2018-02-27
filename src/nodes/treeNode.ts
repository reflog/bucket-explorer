import {Uri} from "vscode";
import {AccountTreeNode} from "./accountNode";
import {FolderTreeNode} from "./folderNode";

export class TreeNode {
    private _resource: Uri;
    public get resource(): Uri {
        return this._resource;
    }

    constructor(public name: string,
                public fullPath: string,
                public account: AccountTreeNode) {
        this._resource = Uri.parse(fullPath);
    }

    public async getChildren(): Promise<TreeNode[]> {
        return [];
    }




    static sortedNodes(nodes: TreeNode[]): TreeNode[] {
        return nodes.sort((n1, n2) => {
            if (n1 instanceof FolderTreeNode && !(n2 instanceof FolderTreeNode)) {
                return -1;
            }

            if (!(n1 instanceof FolderTreeNode) && n2 instanceof FolderTreeNode) {
                return 1;
            }

            return n1.name.localeCompare(n2.name);
        });
    }

    static placeNode(root: FolderTreeNode, path: string) {
        const parts = path.split("/");
        const fn = parts.pop();
        const account = root instanceof AccountTreeNode ? root : root.account;
        if (parts.length === 0) {
            const newFn = `${root.fullPath}/${fn}`;
            root.children.push(new TreeNode(fn, newFn, account));
        } else {
            const foundNode = root.children.find(
                x => x.name === parts[0]
            ) as FolderTreeNode;
            if (foundNode) {
                TreeNode.placeNode(
                    foundNode,
                    parts
                        .slice(1)
                        .concat([fn])
                        .join("/")
                );
            } else {
                const newFn = `${root.fullPath}/${parts[0]}`;
                const newRoot = new FolderTreeNode(parts[0], newFn, account);
                newRoot.children = [];
                root.children.push(newRoot);
                TreeNode.placeNode(
                    newRoot,
                    parts
                        .slice(1)
                        .concat([fn])
                        .join("/")
                );
            }
        }
    }
}
