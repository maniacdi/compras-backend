/**
 * Gestión de WebSockets con Socket.io
 *
 * Cada pareja tiene su propio "room" identificado por su código.
 * Cuando un usuario hace un cambio, se emite al room y todos los
 * demás conectados (la pareja) reciben la actualización al instante.
 *
 * Eventos del cliente → servidor:
 *   join_pareja         - Unirse al room de la pareja
 *   leave_pareja        - Salir del room
 *
 * Eventos servidor → cliente (broadcast al room excepto emisor):
 *   elemento_creado     - Nuevo elemento añadido
 *   elemento_actualizado - Elemento editado (cantidad, notas, etc.)
 *   elemento_toggle     - Elemento marcado/desmarcado como necesario
 *   elemento_eliminado  - Elemento borrado
 *   lista_creada        - Nueva lista añadida
 *   lista_actualizada   - Lista editada
 *   lista_eliminada     - Lista borrada
 *   no_necesarios_limpiados - Se borraron todos los no necesarios
 */

const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket conectado: ${socket.id}`);

    // El cliente se une al room de su pareja
    socket.on('join_pareja', ({ codigo, alias }) => {
      const room = `pareja_${codigo.toUpperCase()}`;
      socket.join(room);
      socket.data.parejaRoom = room;
      socket.data.alias = alias || 'Alguien';
      console.log(`👥 ${alias} se unió al room ${room}`);

      // Avisar al otro de que está conectado
      socket.to(room).emit('pareja_conectada', { alias: socket.data.alias });
    });

    socket.on('leave_pareja', () => {
      if (socket.data.parejaRoom) {
        socket.leave(socket.data.parejaRoom);
        console.log(`🚪 ${socket.data.alias} dejó ${socket.data.parejaRoom}`);
      }
    });

    // ── Elementos ──────────────────────────────────────────────

    socket.on('elemento_creado', (elemento) => {
      socket.to(socket.data.parejaRoom).emit('elemento_creado', elemento);
    });

    socket.on('elemento_actualizado', (elemento) => {
      socket.to(socket.data.parejaRoom).emit('elemento_actualizado', elemento);
    });

    socket.on('elemento_toggle', (elemento) => {
      socket.to(socket.data.parejaRoom).emit('elemento_toggle', elemento);
    });

    socket.on('elemento_eliminado', ({ elementoId, listaId }) => {
      socket
        .to(socket.data.parejaRoom)
        .emit('elemento_eliminado', { elementoId, listaId });
    });

    socket.on('elementos_reordenados', ({ listaId, elementos }) => {
      socket
        .to(socket.data.parejaRoom)
        .emit('elementos_reordenados', { listaId, elementos });
    });

    socket.on('todos_desmarcados', ({ listaId }) => {
      socket.to(socket.data.parejaRoom).emit('todos_desmarcados', { listaId });
    });

    socket.on('todos_marcados', ({ listaId }) => {
      socket.to(socket.data.parejaRoom).emit('todos_marcados', { listaId });
    });

    // ── Listas ─────────────────────────────────────────────────

    socket.on('lista_creada', (lista) => {
      socket.to(socket.data.parejaRoom).emit('lista_creada', lista);
    });

    socket.on('lista_actualizada', (lista) => {
      socket.to(socket.data.parejaRoom).emit('lista_actualizada', lista);
    });

    socket.on('lista_eliminada', ({ listaId }) => {
      socket.to(socket.data.parejaRoom).emit('lista_eliminada', { listaId });
    });

    // ── Desconexión ────────────────────────────────────────────

    socket.on('disconnect', () => {
      if (socket.data.parejaRoom) {
        socket.to(socket.data.parejaRoom).emit('pareja_desconectada', {
          alias: socket.data.alias,
        });
      }
      console.log(`❌ Socket desconectado: ${socket.id}`);
    });
  });
};

module.exports = setupSockets;
