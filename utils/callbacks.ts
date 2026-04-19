import { Socket } from 'socket.io-client';

export function emitCreateRoom(
  socket: Socket,
  username: string,
  minCapacity: number
) {
  socket.emit('create_room', { username, minCapacity });
}

export function emitJoinRoom(
  socket: Socket,
  roomId: string,
  username: string
) {
  socket.emit('join_room', { roomId, username });
}

export function emitStartGame(
  socket: Socket,
  roomId: string,
  settings: { roundDuration: number; rounds: number }
) {
  socket.emit('start_game', { roomId, settings });
}

export function emitSubmitQuestion(
  socket: Socket,
  roomId: string,
  question: string
) {
  socket.emit('submit_question', { roomId, question });
}

export function emitSubmitAnswer(
  socket: Socket,
  roomId: string,
  answer: string
) {
  socket.emit('submit_answer', { roomId, answer });
}

export function emitSubmitMatches(
  socket: Socket,
  roomId: string,
  matches: Record<string, string>
) {
  socket.emit('submit_matches', { roomId, matches });
}
