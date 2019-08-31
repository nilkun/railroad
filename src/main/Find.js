'use strict'
import Vector from "../engine/Vector.js"
export default class FIND {
    static connection(game) {
        const { graph } = game;
    }

    static path(
        graph,
        goal = new Vector(0, 0), 
        start = new Vector(0, 0),
        player,
        g
    ) {
        
        // This data structure keeps track of all explored paths.
        // It is a transposed version of the graph

        const sqrt2 = 1.41421356237;
        const data = new Array(graph.length); 
        for(let i = 0; i < data.length; i++) {
            data[i] = new Array(graph[0].length);
            for(let j = 0; j < data[i].length; j++) {
                data[i][j] = {
                    visited: false,
                    distanceGoal: Infinity,
                    distanceStart: Infinity,
                    parent: null
                }
            }
        }; 
    
        // Calculates the distance using a special implementation of the manhattan method
        const manhattan = (pos1, pos2) => {
            const x = Math.abs(pos1.x - pos2.x);
            const y = Math.abs(pos1.y - pos2.y);
            return x + y;
        }
        
        // Initialize
        let found = false;
        const queue = [];
        let vector; // Vector of indices
        let distance; 
        const game = g;
        
        // Initialize start and add to queue        
        data[start.x][start.y].distanceStart = 0;
        data[start.x][start.y].distanceGoal = manhattan(start, goal);
        queue.push(new Vector(start.x, start.y));
    
        while(queue.length > 0 && !found) {
            // Sort according to distance, could do insertion instead using binary search
            queue.sort((a, b) => {
                data[a.x][a.y].distanceGoal + data[a.x][a.y].distanceStart 
                > data[b.x][b.y].distanceGoal + data[b.x][b.y].distanceStart;
            })
            // First item in queue 
            vector = queue.shift();
            data[vector.x][vector.y].visited = true;
            if(vector.equals(goal)) {
                found = true;
            }
            else {
                // Sets to center of tile (NOT IMPLEMENTED)
                for(let x = -1; x <= 1; x++) {
                    for(let y = -1; y <= 1; y++) {
                        // Check if within bounds
                        if(vector.x + x >= 0 && vector.x + x < data.length) {
                            if(vector.y + y >= 0 && vector.y + y < data[0].length) {
                                // Check if visited
                                if(!data[vector.x + x][vector.y + y].visited && 
                                    (graph[vector.x + x][vector.y + y].owner === 0 || graph[vector.x + x][vector.y + y].owner === player)
                                ) {
                                    // Compare distance to stored distance
                                    if(x === 0 || y === 0) distance = 1;
                                    else distance = sqrt2;
                                    const compare = data[vector.x][vector.y].distanceStart + distance;
                                    if(compare < data[vector.x + x][vector.y + y].distanceStart) {
                                        // Add vector to list if not already on
                                        if(Infinity === data[vector.x + x][vector.y + y].distanceGoal) {
                                            queue.push(new Vector(vector.x + x, vector.y + y));
                                            // Find distance to goal
                                            data[vector.x + x][vector.y + y].distanceGoal = manhattan(new Vector(vector.x + x, vector.y + y), goal);
                                        }
                                        // Set distance to start
                                        data[vector.x + x][vector.y + y].distanceStart = compare;
                                        // Set current as parent
                                        data[vector.x + x][vector.y + y].parent = vector;
                                    }                                    
                                }
                            }
                        }
                    }
                }
            }
        }
        if(found) {
            const solution = [];

            // Stations to update
            const stations = [];
    
            let currentIndices = goal;
            solution.push([currentIndices.x, currentIndices.y]);
            while(data[currentIndices.x][currentIndices.y].parent !== null) {
                currentIndices = data[currentIndices.x][currentIndices.y].parent;
                const tile = graph[currentIndices.x][currentIndices.y];
                tile.owner = player;
                this.hasTrack = true;

                // console.log(tile)
                // do try catch instead?
                if(tile.property) {
                    // ADD STATION TO LIST
                    if(!stations.includes(tile.property.id)) stations.push(tile.property.id);

                    let list = []; 
                    // Add all the station's connections
                    // console.log(tile.property);
                    // tile.property.connectedTo.forEach(d => console.log("data: " + d))
                    for (let [value] of tile.property.connectedTo) {
                        if(!stations.includes(value)) {
                            stations.push(value);
                            list.push(value);
                        }
                    }
                    // Go through all the connections
                    let current;
                    while(undefined !== (current = list.pop())) {
                        for (let [value] of game.allItems.get(current).connectedTo) {

                        // console.log(value)
                            if(!stations.includes(value)) {
                                stations.push(value);
                                list.push(value);
                            }
                        }
                    }
                    // ADD STATIONS CONNECTIONS TO LIST
                }

    
                solution.push([currentIndices.x, currentIndices.y]);
            }

            // DO MANUALLY FOR FIRST NODE!!!

            if(graph[solution[0][0]][solution[0][1]].property) {
                const tile = graph[solution[0][0]][solution[0][1]];
                // ADD STATION TO LIST
                if(!stations.includes(tile.property.id))stations.push(tile.property.id);

                let list = []; 
                // Add all the station's connections
                for (let [value] of tile.property.connectedTo) {
                    if(!stations.includes(value)) {
                        stations.push(value);
                        list.push(value);
                    }
                }
                // Go through all the connections
                let current;
                console.log(list)
                while(undefined !== (current = list.pop())) {
                    console.log(current)
                    for (let [value] of game.allItems.get(current).connectedTo) {
                        if(!stations.includes(value)) {
                            stations.push(value);
                            list.push(value);
                        }
                    }
                }
                // ADD STATIONS CONNECTIONS TO LIST
            }

                // stations.push(graph[solution[0][0]][solution[0][1]].property.id);


            // ADD ALL NEW STATIONS AS CONNECTIONS!!! CALCULATE DISTANCE!!! SAVE ID
            // We now have the ids
            // ADD CONNECTIONS OF CONNECTIONS!!!

            for(let index = 0; index < stations.length; index++) {
                const station = game.allItems.get(stations[index]);
                for(let j = 0; j < stations.length; j++) {
                    station.addConnection(game.allItems.get(stations[j]))   
                }
            }

            // console.log(game.allItems);

            return solution;            
        }
        return [];
    }

    static tracks(
        graph,
        goal = new Vector(0, 0), 
        start = new Vector(0, 0),
        player,
    ) {
        
        // This data structure keeps track of all explored paths.
        // It is a transposed version of the graph

        const sqrt2 = 1.41421356237;
        const data = new Array(graph.length); 
        for(let i = 0; i < data.length; i++) {
            data[i] = new Array(graph[0].length);
            for(let j = 0; j < data[i].length; j++) {
                data[i][j] = {
                    visited: false,
                    distanceGoal: Infinity,
                    distanceStart: Infinity,
                    parent: null
                }
            }
        }; 
    
        // Calculates the distance using a special implementation of the manhattan method
        const manhattan = (pos1, pos2) => {
            const x = Math.abs(pos1.x - pos2.x);
            const y = Math.abs(pos1.y - pos2.y);
            return x + y;
        }
        
        // Initialize
        let found = false;
        const queue = [];
        let vector; // Vector of indices
        let distance; 
        
        // Initialize start and add to queue        
        data[start.x][start.y].distanceStart = 0;
        data[start.x][start.y].distanceGoal = manhattan(start, goal);
        queue.push(new Vector(start.x, start.y));
    
        while(queue.length > 0 && !found) {
            // Sort according to distance, could do insertion instead using binary search
            queue.sort((a, b) => {
                data[a.x][a.y].distanceGoal + data[a.x][a.y].distanceStart 
                > data[b.x][b.y].distanceGoal + data[b.x][b.y].distanceStart;
            })
            // First item in queue 
            vector = queue.shift();
            data[vector.x][vector.y].visited = true;
            if(vector.equals(goal)) {
                found = true;
            }
            else {
                // Sets to center of tile (NOT IMPLEMENTED)
                for(let x = -1; x <= 1; x++) {
                    for(let y = -1; y <= 1; y++) {
                        // Check if within bounds
                        if(vector.x + x >= 0 && vector.x + x < data.length) {
                            if(vector.y + y >= 0 && vector.y + y < data[0].length) {
                                // Check if visited
                                if(!data[vector.x + x][vector.y + y].visited && 
                                    graph[vector.x + x][vector.y + y].owner === player
                                    // && graph[vector.x + x][vector.y + y].hasTrack
                                ) {
                                    console.log("ok")
                                    // Compare distance to stored distance
                                    if(x === 0 || y === 0) distance = 1;
                                    else distance = sqrt2;
                                    const compare = data[vector.x][vector.y].distanceStart + distance;
                                    if(compare < data[vector.x + x][vector.y + y].distanceStart) {
                                        // Add vector to list if not already on
                                        if(Infinity === data[vector.x + x][vector.y + y].distanceGoal) {
                                            queue.push(new Vector(vector.x + x, vector.y + y));
                                            // Find distance to goal
                                            data[vector.x + x][vector.y + y].distanceGoal = manhattan(new Vector(vector.x + x, vector.y + y), goal);
                                        }
                                        // Set distance to start
                                        data[vector.x + x][vector.y + y].distanceStart = compare;
                                        // Set current as parent
                                        data[vector.x + x][vector.y + y].parent = vector;
                                    }                                    
                                }
                            }
                        }
                    }
                }
            }
        }
        if(found) {
            
            const solution = [];    
            let currentIndices = goal;
            solution.push([currentIndices.x, currentIndices.y]);
            while(data[currentIndices.x][currentIndices.y].parent !== null) {
                currentIndices = data[currentIndices.x][currentIndices.y].parent; 
                solution.push([currentIndices.x, currentIndices.y]);             
            }
            return solution;            
        }
        return [];
    }
}
