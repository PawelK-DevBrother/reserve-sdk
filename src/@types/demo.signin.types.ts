export interface DemoSigninArgs {
    username: string;
}
export interface SignInResult {
    jwt: string;
    expires_at: number;
}
export interface ServiceSigninArgs {
    service_api_key: string;
    service_api_secret: string;
}
