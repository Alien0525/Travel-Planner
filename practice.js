onload = function () {
    // create a network
    var curr_data;
    var sz;
    var container = document.getElementById('mynetwork');
    var container2 = document.getElementById('mynetwork2');
    var genNew = document.getElementById('generate-graph');
    var solve = document.getElementById('solve');
    var temptext2 = document.getElementById('temptext2');
    var start = document.getElementById('start');
    var destination = document.getElementById('destination');
    var myForm = document.getElementById('myForm');

    start.addEventListener('input', handleStart);
    destination.addEventListener('input', handleDestination);

    function handleStart(e){
        src = parseInt( e.target.value);
        // console.log(src);
    }
    function handleDestination(e){
        dst = parseInt( e.target.value);
        // console.log(dst);
    }

    // initialise graph options
    var options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '15px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf3c5',
                size: 40,
                color: '#991133',
            }
        }
    };
    // initialize your network!
    var network = new vis.Network(container);
    network.setOptions(options);
    var network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){
        cities = ['Delhi', 'Panaji','Gandhinagar','Shimla', 'Bengaluru','Thiruvananthapuram','Bhopal','Mumbai','Chandigarh','Jaipur','Chennai','Hyderabad','Lucknow','Dehradun','Kolkata', 'Patna', 'Srinagar'];
        sz = cities.length;
        let nodes = [];
        for(let i=1;i<=sz;i++){
            nodes.push({id:i, label: cities[i-1]})
        }
        nodes = new vis.DataSet(nodes);

        let edges = [];
        for(let i=2;i<=sz;i++){
            let neigh = i - Math.floor(Math.random()*Math.min(i-1,3)+1);
            edges.push({from: i, to: neigh, color: 'orange',label: String(Math.floor(Math.random()*70)+31)});
        }


        for(let i=1;i<=sz/2;){
            let n1 = Math.floor(Math.random()*sz)+1;
            let n2 = Math.floor(Math.random()*sz)+1;
            if(n1!=n2){
                if(n1<n2){
                    let tmp = n1;
                    n1 = n2;
                    n2 = tmp;
                }
                let works = 0;
                for(let j=0;j<edges.length;j++){
                    if(edges[j]['from']===n1 && edges[j]['to']===n2) {
                        works = 1;
                    }
                }

                if(works <= 1) {
                    if (works === 0 && i < sz / 4) {
                        edges.push({
                            from: n1,
                            to: n2,
                            color: 'orange',
                            label: String(Math.floor(Math.random() * 70) + 31)
                        });
                    }
                    i++;
                }
            }
        }

        let data = {
            nodes: nodes,
            edges: edges
        };
        curr_data = data;
    }

    genNew.onclick = function () {
        createData();
        network.setData(curr_data);
        temptext2.innerText = 'Find the least time path from source to destination according to the map';
        temptext2.style.display = "inline";
        container2.style.display = "none";
        myForm.style.display = "inline";
    };

    solve.onclick = function () {
        temptext2.style.display  = "none";
        container2.style.display = "inline";
        myForm.style.display = "none";
        network2.setData(solveData(sz));
    };

    function dijkstra(graph, sz, src) {
        let vis = Array(sz).fill(0);
        let dist = [];
        for(let i=1;i<=sz;i++)
            dist.push([10000,-1]);
        dist[src][0] = 0;

        for(let i=0;i<sz-1;i++){
            let mn = -1;
            for(let j=0;j<sz;j++){
                if(vis[j]===0){
                    if(mn===-1 || dist[j][0]<dist[mn][0])
                        mn = j;
                }
            }

            vis[mn] = 1;
            for(let j in graph[mn]){
                let edge = graph[mn][j];
                if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
                    dist[edge[0]][0] = dist[mn][0]+edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }

        return dist;
    }

    function solveData(sz) {
        // src = 1;
        // dst = sz;

        let data = curr_data;
        let graph = [];
        for(let i=1;i<=sz;i++){
            graph.push([]);
        }

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            graph[edge['to']-1].push([edge['from']-1,parseInt(edge['label'])]);
            graph[edge['from']-1].push([edge['to']-1,parseInt(edge['label'])]);
        }

        let dist1 = dijkstra(graph,sz,src-1);

        new_edges = [];
        new_edges.concat(pushEdges(dist1, dst-1));

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    function pushEdges(dist, curr) {
        tmp_edges = [];
        while(dist[curr][0]!=0){
            let fm = dist[curr][1];
            new_edges.push({arrows: { to: { enabled: true}},from: fm+1, to: curr+1, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return tmp_edges;
    }

    genNew.click();
};