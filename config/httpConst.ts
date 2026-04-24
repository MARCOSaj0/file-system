export interface HttpConstants {
    Ok: number;
    Cretaed: number;
    NoContent: number;
    BadRequest: number;
    Forbidden: number;
    NotFound: number;
    PayloadTooLarge: number;
    UnsupportedMediaType: number;
    BadGateway: number;
    ServiceUnavailable: number;
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
    PayloadTooLarge: 413,
    UnsupportedMediaType: 415,
    BadGateway: 502,
    ServiceUnavailable: 503,
    InternalServerError: 500,
    perPageLimit: 10
};