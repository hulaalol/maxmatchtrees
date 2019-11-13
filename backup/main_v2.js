
// Initialise sigma:


window.onload = function () {



    class Node {
        constructor(name, weight2Parent) {
          this.name = name;
          this.weight2Parent = weight2Parent;
          this.max0 = 0;
          this.max1 = 0;
          this.matchings = [];
        }
      }

      function findInTree(id){
        return tree.find(function (node) {
            return id == node.data.name;
          })

      }


    var tree = new Arboreal()

    tree.appendChild(new Node("r",0));

    // example 1
    /*
    findInTree("r").appendChild(new Node("a",1));
    findInTree("r").appendChild(new Node("b",90));
    //findInTree("r").appendChild(new Node("i",5000));

    findInTree("a").appendChild(new Node("e",500));
    findInTree("a").appendChild(new Node("f",1));

    findInTree("b").appendChild(new Node("c",50));
    findInTree("b").appendChild(new Node("d",100));

    findInTree("c").appendChild(new Node("g",10));
    findInTree("d").appendChild(new Node("h",80));
    */

    /*
    // example 2
    findInTree("r").appendChild(new Node("a",700));
    findInTree("r").appendChild(new Node("b",500));
    //findInTree("r").appendChild(new Node("i",5000));

    findInTree("b").appendChild(new Node("c",68));
    findInTree("b").appendChild(new Node("d",501));

    findInTree("c").appendChild(new Node("e",12));
    findInTree("c").appendChild(new Node("f",50));
*/


    // example 3
    findInTree("r").appendChild(new Node("a",50));
    findInTree("r").appendChild(new Node("b",100));
    findInTree("r").appendChild(new Node("c",1000));

    findInTree("b").appendChild(new Node("d",1));
    findInTree("d").appendChild(new Node("e",10000));
    findInTree("e").appendChild(new Node("f",100000));


    function jsonCopy(src) {
        return JSON.parse(JSON.stringify(src));
      }

    function splitTree(tree){
        var trees = [];
        for(var i=0; i<tree.children.length;i++){
            trees.push(tree.children[i]);
        }
        return trees;
    }


    
    function maxMatching(tree){


if(tree.children[0]){
//        if(tree.length>4){
            var trees = splitTree(tree);
            for(var i=0; i<trees.length;i++){
                 var res = maxMatching(trees[i]);
                 findInTree(tree.data.name).data.matchings.push(res);
            }

            // pick all childrens max1
            var max0 = 0;
            for(var i=0; i< tree.children.length; i++){
                max0+= tree.children[i].data.max1;
            }

            // pick all but one childrens max1, pick max0 from the not picked children and add weight to parent from not picked children
            var candidates = [];
            for(var i=0; i< tree.children.length; i++){
                //pick all children except 1

                // pick i childth
                var sumOtherChildren = 0;
                for(var j=0; j<tree.children.length;j++){
                    if(i!=j){
                        sumOtherChildren+= tree.children[j].data.max1;
                    }else{
                        sumOtherChildren+= tree.children[j].data.max0;
                        sumOtherChildren+= tree.children[j].data.weight2Parent;
                    }
                }
                candidates.push(sumOtherChildren);
            }
            var max1 = Math.max.apply(Math,candidates);

            tree.data.max0 = max0;
            tree.data.max1 = max1;

     
           return [max0,max1];
        }else{
            if(tree.children[1]){
                console.log("tree children 1");
                var max0 = 0;
                var max1 = Math.max(tree.children[0].data.weight2Parent, tree.children[1].data.weight2Parent);

                if(max1 > tree.data.max1){
                    tree.data.max1 = max1;
                }
                if(max0 > tree.data.max0){
                    tree.data.max0 = max0;
                }

                return [max0,max1];
            }else{

                // node has only 1 child
                if(tree.children[0]){
                    console.log("tree children 0");
                    tree.data.max1 = tree.children[0].data.weight2Parent;
                    tree.data.max0 = 0;
                    return [0, tree.children[0].data.weight2Parent];
                }else{
                    console.log("tree children no children");
                    //return[0,0];
                    tree.parent.data.max1 = tree.data.weight2Parent;
                    return[0,tree.data.weight2Parent]
                }
            }
        }
    }


/*
    function maxMatching(tree){
        if(tree.length>4){
            var trees = splitTree(tree);
            for(var i=0; i<trees.length;i++){
                 var res = maxMatching(trees[i]);
                 console.log(res);
                 findInTree(tree.data.name).data.matchings.push(res);
            }
            // r,0
            var m0 = 0;
            for(var i=0;i<findInTree(tree.data.name).data.matchings.length; i++){
                m0+= findInTree(tree.data.name).data.matchings[i][1];
            }
            // r,1
            var m1= [];
            var k=findInTree(tree.data.name).data.matchings.length-1;
            for(var i=0;i<findInTree(tree.data.name).data.matchings.length; i++){
                var sum = 0;
                sum+= findInTree(tree.data.name).data.matchings[i][k];
                sum+= findInTree(tree.data.name).data.matchings[i+k][i];
                sum+=tree.children[1-i].data.weight2Parent;

                m1.push(sum);
                k = k-1;
            }
            var m2 = Math.max.apply(Math,m1);
            return[m0,m2];
        }else{
            if(tree.children[1]){
                return [0,Math.max(tree.children[0].data.weight2Parent, tree.children[1].data.weight2Parent)];
            }else{
                if(tree.children[0]){
                    return [0,tree.children[0].data.weight2Parent];
                }else{
                    return [0,tree.data.weight2Parent];
                }
            }
        }
    }

*/
   console.log( maxMatching(tree.children[0]));



    










    var s = new sigma(
        {
            renderer: {
                container: document.getElementById('sigma-container'),
                type: 'canvas'
            },
            settings: {
                edgeLabelSize: 'proportional',
                minArrowSize: 10
            }
        }
    );

    // Generate a random graph:
    var nbNode = 50;
    var nbEdge = 100;
    var graph = {
        nodes: [],
        edges: []
    };


    graph.nodes.push({
        id: 0,
        label: "r",
        x: 0,
        y: 0,
        size: 1,
    });


    graph.nodes.push({
        id: 1,
        label: "a",
        x: -1,
        y: 1,
        size: 1,
    });

    graph.nodes.push({
        id: 2,
        label: "b",
        x: 1,
        y: 1,
        size: 1,
    });


    graph.edges.push({
        id: 1,
        label: "1",
        source: 0,
        target: 1,
        type: 'curvedArrow'
    });

    graph.edges.push({
        id: 2,
        label: "90",
        source: 0,
        target: 2,
        type: 'curvedArrow'
    });












    // load the graph
    s.graph.read(graph);
    // draw the graph
    s.refresh();
    // launch force-atlas for 5sec
    //s.startForceAtlas2();
    //window.setTimeout(function() {s.killForceAtlas2()}, 10000);



};
