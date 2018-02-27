import {ProgressLocation, Uri, window} from "vscode";
import {SolidBucket} from "../solid-bucket";
import {FolderTreeNode} from "./folderNode";
import {TreeNode} from "./treeNode";

export class AccountTreeNode extends FolderTreeNode {
    private client: any;

    constructor(name: string,
                provider: string,
                parameters: any,
                private bucketName: string) {
        super(name, `bucket://${name}`, undefined);
        this.client = new SolidBucket(provider, parameters);
    }

    public nodeByUri(uri: Uri): TreeNode {
        function finder(root: TreeNode): TreeNode {
            if (root instanceof AccountTreeNode || root instanceof FolderTreeNode) {
                for (let i = 0; i < root.children.length; i++) {
                    const node = finder(root.children[i]);
                    if (node) {
                        return node;
                    }
                }
            } else {
                if (root.resource.toString() === uri.toString()) {
                    return root;
                }
            }
            return undefined;
        }

        return finder(this);
    }

    public async getChildren(): Promise<TreeNode[]> {
        if (this.children) return this.children;

        return window.withProgress(
            {
                location: ProgressLocation.Window,
                title: "Listing..."
            },
            async () => {
                try {
                    const resp = await this.client.getListOfObjectsFromBucket(
                        this.bucketName
                    );
                    if (resp.status !== 200) {
                        throw new Error(resp);
                    }
                    this.children = [];
                    resp.data.forEach(path => TreeNode.placeNode(this, path.filename));
                    return TreeNode.sortedNodes(this.children);
                } catch (resp) {
                    throw new Error(resp.message);
                }
            }
        );
    }

    public async getContent(resource: Uri): Promise<string> {
        return window.withProgress(
            {
                location: ProgressLocation.Window,
                title: "Downloading..."
            },
            async () => {
                try {
                    const resp = await this.client.getObjectFromBucket(
                        this.bucketName,
                        resource.path.startsWith("/" + this.bucketName)
                            ? resource.path.substr(("/" + this.bucketName).length + 1)
                            : resource.path
                    );
                    if (resp.status !== 200) {
                        throw Error(resp);
                    }
                    return resp.data;
                } catch (resp) {
                    console.log(resp.message);
                }
            }
        );
    }
}
