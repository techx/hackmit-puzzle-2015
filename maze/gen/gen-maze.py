#!/usr/bin/env python3

import sys, random

WALL = '#'
CLEAR = ' '

def main():
    if len(sys.argv) != 3:
        print('Usage: %s [width] [height]' % sys.argv[0], file=sys.stderr)
        exit(1)
    width, height = map(int, sys.argv[1:])
    nodes = [[False for i in range(width)] for j in range(height)]
    def inbounds(x, y):
        return 0 <= x < width and 0 <= y < height
    def done(node):
        x, y = node
        return inbounds(x, y) and nodes[y][x]
    def pending(node):
        x, y = node
        return inbounds(x, y) and not nodes[y][x]
    nodes[0][0] = True
    adj = set([(1, 0), (0, 1)])
    edges = set()
    while adj:
        [node] = random.sample(adj, 1)
        adj.remove(node)
        x, y = node
        nodes[y][x] = True
        # randomly choose node to connect to
        neighbors = set([(x+1,y), (x-1,y), (x,y+1), (x,y-1)])
        connect_options = set(n for n in neighbors if done(n))
        [connect] = random.sample(connect_options, 1)
        edges.add((node, connect))
        # add new adjacent nodes
        explore = set(n for n in neighbors if pending(n))
        adj.update(explore)
    pretty_print(width, height, edges)

def pretty_print(width, height, edges):
    p_width = 2 * width - 1
    p_height = 2 * height - 1
    grid = [[WALL for i in range(p_width)] for j in range(p_height)]
    for x in range(width):
        for y in range(height):
            grid[2*y][2*x] = CLEAR
    for edge in edges:
        start, end = edge
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        x = start[0] * 2 + dx
        y = start[1] * 2 + dy
        grid[y][x] = CLEAR
    # print with outer wall
    print(WALL * (p_width + 2))
    for line in grid:
        print('%s%s%s' % (WALL, ''.join(line), WALL))
    print(WALL * (p_width + 2))


if __name__ == '__main__':
    main()
