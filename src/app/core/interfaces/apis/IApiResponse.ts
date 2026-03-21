export interface ApiResponse<T> {
    data: T;
    serverResponse: ServerResponse,
    pagination: Pagination
}

export interface ServerResponse {
    mensaje: string,
    exito: boolean,
    errores: [string],
    errorId: string
}

export interface Pagination {
    totalRegistros: number,
    registrosPorPagina: number,
    paginaActual: number,
    totalPaginas: number
}