class Graph {
    root: Node
    nextID: number = 1

    constructor() {
        this.root = new Node(undefined,0)
    }

    addNode(identifier: number) {
        const element = this.root.findNode(identifier)
        if(!element) return null
        const next = new Node(element,this.nextID)
        this.nextID = this.nextID + 1
        element.children.push(next)
    }

    // deleting from array shifts all the identifiers over
    removeNode(identifier: number) {
        var element = this.root.findNode(identifier)
        if(!element) return null
        element = null
    }
}

class Node {
    parent: Node | undefined
    children: Array<Node>
    id: number

    constructor(par : Node | undefined, identifier: number) {
        this.parent = par
        this.children = []
        this.id = identifier
    }

    findNode(identifier: number) : Node | null {
        if(this.id == identifier) {
            return this
        }

        for(const child of this.children) {
            const outcome = child.findNode(identifier)
            if(outcome) return outcome
        }

        return null;
    }
}