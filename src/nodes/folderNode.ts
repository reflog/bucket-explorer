import {TreeNode} from "./treeNode";

export class FolderTreeNode extends TreeNode {
    children: TreeNode[];

    public async getChildren(): Promise<TreeNode[]> {
        return TreeNode.sortedNodes(this.children);
    }
}
