export class GraphQlCustomError extends Error {
    msg: string;
    statusCode: number;
    query: string;
    variables: any;
    constructor(obj: {msg: string; statusCode: number; query: string; variables: any}) {
        super();
        this.msg = obj.msg;
        this.statusCode = obj.statusCode;
        this.query = obj.query;
        this.variables = obj.variables;
    }
}
