
// Initialise sigma:
var graph = {
    nodes: [],
    edges: []
};
var tree;
var exid = 0;
var s;

var nmaximum = 5;
var nminimum = -5;


class Node {
    constructor(name, weight2Parent) {
        this.name = name;
        this.weight2Parent = weight2Parent;
        this.max0 = 0;
        this.max1 = 0;
        this.max0edges = [];
        this.max1edges = [];
        this.matchings = [];
    }
}


function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}

function resetGraph(){
    var graph = {
        nodes: [],
        edges: []
    };
    return graph;
}

function addEdge(edge){

    for(var i=0; i<graph.edges.length;i++){
        if(edge.id == graph.edges[i].id){
            return
        }
    }
    graph.edges.push(edge);
}
function addNode(node){
    graph.nodes.push(node);
}

function iterator (node) {
    if(node.data.name){
        addNode({
            id: node.data.name,
            label: node.data.name,
            x: (Math.random() * (nmaximum - nminimum + 1) ) << 0,
            y: (Math.random() * (nmaximum - nminimum + 1) ) << 0,
            size: 1,
        })

        for(var i=0; i<node.children.length; i++){

            var edgeName = "("+node.data.name+","+node.children[i].data.name+")";
            var edgeName2 = "("+node.children[i].data.name+","+node.data.name+")";

            if(tree.children[0].data.max0 > tree.children[0].data.max1){

                for(var k=0; k< tree.children[0].data.max0edges.length; k++){

                    if(edgeName == tree.children[0].data.max0edges[k] || edgeName2 == tree.children[0].data.max0edges[k]){
                     
                            addEdge({
                                id: "("+node.data.name+","+node.children[i].data.name+")",
                                label: ""+node.children[i].data.weight2Parent,
                                source: node.data.name,
                                target: node.children[i].data.name,
                                type: 'curvedArrow',
                                color: "#F00",
                                size: 10
                            })

                            break;

                       

                    }
                }
            }else{
                for(var k=0; k< tree.children[0].data.max1edges.length; k++){

                    if(edgeName == tree.children[0].data.max1edges[k] || edgeName2 == tree.children[0].data.max1edges[k]){
                        addEdge({
                            id: "("+node.data.name+","+node.children[i].data.name+")",
                            label: ""+node.children[i].data.weight2Parent,
                            source: node.data.name,
                            target: node.children[i].data.name,
                            type: 'curvedArrow',
                            color: "#F00",
                            size: 10
                        })
                        break;

                    }
                }


            }

            
                addEdge({
                    id: "("+node.data.name+","+node.children[i].data.name+")",
                    label: ""+node.children[i].data.weight2Parent,
                    source: node.data.name,
                    target: node.children[i].data.name,
                    type: 'curvedArrow'
                })

         




        }
    }

}





function findInTree(id) {
    return tree.find(function (node) {
        return id == node.data.name;
    })

}

function splitTree(tree) {
    var trees = [];
    for (var i = 0; i < tree.children.length; i++) {
        trees.push(tree.children[i]);
    }
    return trees;
}

function maxMatching(tree) {
    //divide
    if (tree.children[0]) {
        var trees = splitTree(tree);
        for (var i = 0; i < trees.length; i++) {
            maxMatching(trees[i]);
        }
        // combine results
        // pick all childrens max1
        var max0 = 0;
        var rememberEdges = [];
        for (var i = 0; i < tree.children.length; i++) {
            //max0 += tree.children[i].data.max1;
            max0 += Math.max(tree.children[i].data.max1,tree.children[i].data.max0);

           if(tree.children[i].data.max1 > tree.children[i].data.max0){
            rememberEdges.push(tree.children[i].data.max1edges)
           }else{
               rememberEdges.push(tree.children[i].data.max0edges)
            }
        }
        // pick all but one childrens max1, pick max0 from the not picked children and add weight to parent from not picked children
        var candidates = [];
        var candidatesRememberEdges = [];

        for (var i = 0; i < tree.children.length; i++) {
            //pick all children except 1 --> pick i childth
            var sumOtherChildren = 0;
            var candidateRemember = [];
            for (var j = 0; j < tree.children.length; j++) {
                if (i != j) {
                    sumOtherChildren += Math.max( tree.children[j].data.max1, tree.children[j].data.max0);
                    candidateRemember.push(tree.children[j].data.max1edges);
                } else {
                    sumOtherChildren += tree.children[j].data.max0;
                    sumOtherChildren += tree.children[j].data.weight2Parent;

                    candidateRemember.push("("+tree.data.name+","+tree.children[j].data.name+")");
                    candidateRemember.push(tree.children[j].data.max0edges);

                }
            }
            candidatesRememberEdges.push(candidateRemember);
            candidates.push(sumOtherChildren);
        }
        var max1 = Math.max.apply(Math, candidates);
        var finalCandidate = "null";
        for(var k=0;k<candidates.length;k++){
            if(max1 == candidates[k]){
                finalCandidate = candidatesRememberEdges[k];
                break;
            }
        }

        if(max0 > tree.data.max0){
            tree.data.max0 = max0;
            tree.data.max0edges = rememberEdges;
        }
        if(max1 > tree.data.max1){
            tree.data.max1 = max1;
            tree.data.max1edges = finalCandidate;
        }
        tree.data.max0edges = tree.data.max0edges.flat(100);
        tree.data.max1edges = tree.data.max1edges.flat(100);
        return [max0, max1];


    } else {
        // conquer
        if(tree.data.weight2Parent > tree.parent.data.max1){
            tree.parent.data.max1 = tree.data.weight2Parent;
            tree.parent.data.max1edges = ["("+tree.data.name+","+tree.parent.data.name+")"];
        }
        return[0,tree.parent.data.max1];
    }
}





function doExample(){
    
    if(s && s.graph.edges().length>0){
        s.graph.clear();
        s.graph.kill();

        clearBox("sigma-container");
    }

    graph = resetGraph();
    if(exid <4){
        exid +=1;
    }else{
        exid = 1;
    }


    var example = "example"+(exid);

    tree = new Arboreal()

    tree.appendChild(new Node("r", 0));

    // example 1
    if (example == "example1") {
        findInTree("r").appendChild(new Node("a", 1));
        findInTree("r").appendChild(new Node("b", 90));
        //findInTree("r").appendChild(new Node("i",5000));

        findInTree("a").appendChild(new Node("e", 500));
        findInTree("a").appendChild(new Node("f", 1));

        findInTree("b").appendChild(new Node("c", 50));
        findInTree("b").appendChild(new Node("d", 100));

        findInTree("c").appendChild(new Node("g", 10));
        findInTree("d").appendChild(new Node("h", 80));
    }





    if (example == "example2") {
        // example 2
        findInTree("r").appendChild(new Node("a", 700));
        findInTree("r").appendChild(new Node("b", 500));
        //findInTree("r").appendChild(new Node("i",5000));

        findInTree("b").appendChild(new Node("c", 68));
        findInTree("b").appendChild(new Node("d", 501));

        findInTree("c").appendChild(new Node("e", 12));
        findInTree("c").appendChild(new Node("f", 50));
    }

    // example 3
    if (example == "example3") {
        findInTree("r").appendChild(new Node("a", 50));
        findInTree("r").appendChild(new Node("b", 100));
        findInTree("r").appendChild(new Node("c", 1000));

        findInTree("b").appendChild(new Node("d", 1));
        findInTree("d").appendChild(new Node("e", 10000));
        findInTree("e").appendChild(new Node("f", 100000));

        // new
        //findInTree("e").appendChild(new Node("z", 10000000));


        findInTree("f").appendChild(new Node("g", 1000000));
    }

    if (example == "example4") {
        findInTree("r").appendChild(new Node("a", 1));
        findInTree("r").appendChild(new Node("b", 8));
        findInTree("r").appendChild(new Node("c", 9));
    }

    console.log(maxMatching(tree.children[0]));
    console.log(tree.children[0].data.max0edges);
    console.log(tree.children[0].data.max1edges);



    tree.traverseDown(iterator);



    s = new sigma(
        {
            renderer: {
                container: document.getElementById('sigma-container'),
                type: 'canvas'
            },
            settings: {
                defaultEdgeLabelSize: 40,
                labelThreshold: 0,
                defaultLabelSize: 40,
                minArrowSize: 10
            }
        }
    );
    // load the graph
    s.graph.read(graph);
    // draw the graph
    s.refresh();
    // launch force-atlas for 5sec
    s.startForceAtlas2();
    window.setTimeout(function() {s.killForceAtlas2()}, 500);

}