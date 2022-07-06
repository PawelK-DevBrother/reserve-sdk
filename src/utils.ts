export class GraphQlCustomError extends Error {
    msg: string;
    statusCode: number;
    query: string;
    variables: any;
    constructor(msg: string, statusCode: number, query: string, variables: any) {
        super();
        this.msg = msg;
        this.statusCode = statusCode;
        this.query = query;
        this.variables = variables;
    }
}
