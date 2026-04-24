export interface HttpConstants {
    Ok: number;
    Cretaed: number;
    NoContent: number;
    BadRequest: number;
    Forbidden: number;
    NotFound: number;
    InternalServerError: number;
    perPageLimit: number;
}

export const httpConst: HttpConstants = {
    Ok: 200,
    Cretaed: 201,
    NoContent: 204,
    BadRequest: 400,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500,
    perPageLimit: 10
};