const posViewer = document.getElementById("pos")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const ResolutionValue = 1600 / 800
const Width = canvas.width * ResolutionValue
const Height = canvas.height * ResolutionValue

const PI2 = Math.PI * 2
const MaxNodeCount =200
const NodeSize = 5
const ConnectRange = 200
const CountOfNode = 200

const SelectSize = 20
const HoverBigger = 10

let SelectedNode = undefined
let HoverNode = undefined

function distance(A, B) {
    return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function random(m) {
    return Math.random() * m
}

const print = (text) => { console.log(text) }

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Node {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r

        this.connecting_node = []
        this.nodes = []

        this.color = "black"
    }
    posToStr() {
        return `(${parseInt(this.x)}, ${parseInt(this.y)})`
    }
    draw() {
        ctx.lineWidth = 2
        ctx.fillStyle = this.color
        ctx.strokeStyle = this.color

        for (var i = 0; i < this.connecting_node.length; i++) {
            ctx.beginPath()
            if (this.color === "red" && this !== SelectedNode) {
                if (this.connecting_node[i] === SelectedNode) {
                    ctx.strokeStyle = "red"
                }
                else {
                    ctx.strokeStyle = "black"
                }
            }
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.connecting_node[i].x, this.connecting_node[i].y)
            ctx.stroke()
            ctx.closePath()
        }

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, PI2)
        ctx.fill()
        ctx.closePath()
    }
    connectNode(node) {
        if (this == node) {
            return false
        }
        if (this.nodes.length + 1 >= MaxNodeCount || node.nodes.length + 1 >= MaxNodeCount) {
            return false
        }
        this.connecting_node.push(node)
        this.nodes.push(node)
        node.nodes.push(this)
        return true
    }
}

const renderList = []
for (var i = 0; i < CountOfNode; i++) {
    renderList.push(new Node(random(1300) + 100, random(1300) + 100, NodeSize))
}

//Connect Node
for (var i = 0; i < renderList.length; i++) {
    const around = []
    for (var j = i + 1; j < renderList.length; j++) {
        if (distance(renderList[i], renderList[j]) < ConnectRange) {
            around.push(renderList[j])
        }
    }
    for (var j = 0; j < around.length; j++) {
        if (renderList[i] === around[j]) {
            continue
        }
        if (renderList[i].nodes.length >= MaxNodeCount) {
            break
        }
        renderList[i].connectNode(around[j])
    }
}

function render() {
    ctx.clearRect(0, 0, Width, Height)
    for (var i = 0; i < renderList.length; i++) {
        renderList[i].draw()
    }
    if (SelectedNode !== undefined) {
        SelectedNode.draw()
        for (var i = 0; i < SelectedNode.nodes.length; i++) {
            SelectedNode.nodes[i].draw()
        }
    }
    requestAnimationFrame(render)
}

render()

//Event Function
canvas.addEventListener("mousemove", (e) => {
    const pos = new Vector(e.offsetX * ResolutionValue, e.offsetY * ResolutionValue)
    posViewer.innerText = `(${pos.x}, ${pos.y})`
    if (SelectedNode !== undefined) {
        SelectedNode.x = e.offsetX * ResolutionValue
        SelectedNode.y = e.offsetY * ResolutionValue
        return
    }

    if (HoverNode !== undefined && distance(HoverNode, pos) > HoverNode.r) {
        HoverNode.r = NodeSize
        HoverNode = undefined
    }
    for (var i = 0; i < renderList.length; i++) {
        if (HoverNode == renderList[i]) {
            continue
        }
        if (distance(renderList[i], pos) <= SelectSize) {
            if (HoverNode !== undefined) {
                HoverNode.r = NodeSize
            }
            HoverNode = renderList[i]
            HoverNode.r = NodeSize + HoverBigger
            break
        }
    }
})

canvas.addEventListener("mousedown", (e) => {
    const pos = new Vector(e.offsetX * ResolutionValue, e.offsetY * ResolutionValue)
    for (var i = 0; i < renderList.length; i++) {
        if (distance(renderList[i], pos) <= SelectSize) {
            SelectedNode = renderList[i]
            SelectedNode.color = "red"
            for (var j = 0; j < SelectedNode.nodes.length; j++) {
                SelectedNode.nodes[j].color = "red"
            }
            break
        }
    }
})

canvas.addEventListener("mouseup", (e) => {
    if (SelectedNode !== undefined) {
        SelectedNode.color = "black"
        for (var j = 0; j < SelectedNode.nodes.length; j++) {
            SelectedNode.nodes[j].color = "black"
        }
        SelectedNode = undefined
    }
})