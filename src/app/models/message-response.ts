export interface MessageResponse<T> {
    success?: boolean,
    errorMessage?: string,
    response?: T,
    listaParticipantes?: T 
}
