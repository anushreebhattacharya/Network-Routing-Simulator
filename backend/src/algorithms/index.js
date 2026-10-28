import { runDijkstra } from './dijkstra.js';
import { runBellmanFord } from './bellmanFord.js';
import { runBfs } from './bfs.js';
import { AppError } from '../utils/AppError.js';

export const ALGORITHM_IDS = ['dijkstra', 'bellman-ford', 'bfs'];

export function runAlgorithmById(algorithm, adjacency, source, destination) {
  switch (algorithm) {
    case 'dijkstra':
      return runDijkstra(adjacency, source, destination);
    case 'bellman-ford':
      return runBellmanFord(adjacency, source, destination);
    case 'bfs':
      return runBfs(adjacency, source, destination);
    default:
      throw new AppError(
        `Unsupported algorithm "${algorithm}". Use dijkstra, bellman-ford, or bfs.`,
        400,
        'UNSUPPORTED_ALGORITHM',
      );
  }
}
