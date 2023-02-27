const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const PI2 = Math.PI * 2
const MaxNodeCount = 5
const NodeSize = 5
const ConnectRange = 200

function distance(A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function random(m) {
    return Math.random() * m
}

const print = (text) => { console.log(text) }

class Node {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r

        this.connecting_node = []
        this.nodes = []
    }
    posToStr() {
        return `(${this.x}, ${this.y})`
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, PI2)
        ctx.fill()
        ctx.closePath()

        for (var i = 0; i < this.connecting_node.length; i++) {
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.connecting_node[i].x, this.connecting_node[i].y)
            ctx.stroke()
            ctx.closePath()
        }
    }
    connectNode(node) {
        if (this.nodes.length > MaxNodeCount || node.nodes.length > MaxNodeCount) {
            return false
        }
        this.connecting_node.push(node)
        this.nodes.push(node)
        node.nodes.push(node)
        return true
    }
}

const renderList = []
for(var i =0; i<20; i++){
    renderList.push(new Node(random(500) + 100, random(500) + 100, NodeSize))
}

for (var i = 0; i < renderList.length; i++) {
    const around = []
    for (var j = i + 1; j < renderList.length; j++) {
        if (distance(renderList[i], renderList[j]) < ConnectRange) {
            around.push(renderList[j])
        }
        if (around.length >= MaxNodeCount) break
    }
    for (var j = 0; j < around.length; j++) {
        renderList[i].connectNode(around[j])
    }
}

function render() {
    for (var i = 0; i < renderList.length; i++) {
        renderList[i].draw()
    }
    requestAnimationFrame(render)
}
render()