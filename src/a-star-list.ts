// Adapted from: https://briangrinstead.com/blog/astar-search-algorithm-in-javascript/

// BEGIN types
export type PositionType = {
  x: number;
  y: number;
};

export type SearchArgsType = {
  grid: GridNode[][];
  start: GridNode;
  end: GridNode;
};

export type HeuristicArgsType = {
  pos0: PositionType;
  pos1: PositionType;
};

export type NeighborsArgsType = {
  grid: any[][];
  node: any;
};

export type GridNode = {
  // cost: number;
  // closed: boolean;
  debug: string;
  fScore: number;
  gScore: number;
  heuristic: number;
  isBoundary: boolean;
  neighbors: GridNode[];
  parent: GridNode | null;
  pos: PositionType;
  // visited: boolean;
};

// END types

export class AStarList {
  // constructor(grid: GridNode[][]) {}

  // Methods
  static heuristic({ pos0, pos1 }: HeuristicArgsType) {
    // This is the Manhattan distance
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  }

  static init(grid: GridNode[][]) {
    for (let rowsIndex = 0; rowsIndex < grid.length; rowsIndex++) {
      for (
        let columnsIndex = 0;
        columnsIndex < grid[rowsIndex].length;
        columnsIndex++
      ) {
        grid[rowsIndex][columnsIndex].fScore = 0;
        grid[rowsIndex][columnsIndex].gScore = 0;
        grid[rowsIndex][columnsIndex].heuristic = 0;
        grid[rowsIndex][columnsIndex].debug = "";
        grid[rowsIndex][columnsIndex].parent = null;
      }
    }
  }

  static neighbors({ grid, node }: NeighborsArgsType) {
    const ret: GridNode[] = [];
    const { x, y } = node.pos;

    // Left
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }
    // Right
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }
    // Bottom
    if (grid[x][y - 1] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }
    // Top
    if (grid[x][y + 1] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }
    return ret;
  }

  static search({ end, grid, start }: SearchArgsType) {
    AStarList.init(grid);

    let openList: GridNode[] = [];
    let closedList: GridNode[] = [];
    openList.push(start);

    while (openList.length > 0) {
      // Grab the lowest f(x) to process next
      let lowInd = 0;

      for (let i = 0; i < openList.length; i++) {
        if (openList[i].fScore < openList[lowInd].fScore) {
          lowInd = i;
        }
      }

      let currentNode: GridNode = openList[lowInd];

      // End case -- result has been found, return the traced path
      if (currentNode.pos == end.pos) {
        let curr: GridNode = currentNode;
        let ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors
      // ↓↓↓ OLD IMPLEMENTATION WHICH POLLUTES ARRAY PROTOTYPE ↓↓↓
      // openList.removeGraphNode(currentNode);

      // My own version which uses Array filter
      openList = openList.filter(
        (node) =>
          node.pos.x === currentNode.pos.x && node.pos.y === currentNode.pos.y
      );

      closedList.push(currentNode);

      let neighbors = AStarList.neighbors({ grid, node: currentNode });

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor: GridNode = neighbors[i];
        // If the current node is in the closed list OR
        // if the current node is a wall...
        if (
          closedList.some((node) => {
            return (
              node.pos.x === neighbor.pos.x && node.pos.y === neighbor.pos.y
            );
          }) ||
          neighbor.isBoundary
        ) {
          // ...then it is not a valid node to process, skip to next neighbor
          continue;
        }

        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        let gScore = currentNode.gScore + 1; // 1 is the distance from a node to it's neighbor
        let gScoreIsBest = false;

        // ↓↓↓ OLD IMPLEMENTATION WHICH POLLUTES ARRAY PROTOTYPE ↓↓↓
        // if (!openList.findGraphNode(neighbor)) {

        // My own interpretation
        if (
          !openList.some((node) => {
            return (
              node.pos.x === neighbor.pos.x && node.pos.y === neighbor.pos.y
            );
          })
        ) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;
          neighbor.heuristic = AStarList.heuristic({
            pos0: neighbor.pos,
            pos1: end.pos,
          });
          openList.push(neighbor);
        } else if (gScore < neighbor.gScore) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.   Store info on how we got here and
          //  just how good it really is...
          neighbor.parent = currentNode;
          neighbor.gScore = gScore;
          neighbor.fScore = neighbor.gScore + neighbor.heuristic;
          neighbor.debug =
            "F: " +
            neighbor.fScore +
            "<br />G: " +
            neighbor.gScore +
            "<br />H: " +
            neighbor.heuristic;
        }
      }
    }

    // No result was found -- empty array signifies failure to find path
    return [];
  }
}
