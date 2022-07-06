export interface DemoSigninArgs {
    username: string;
}
export interface SignInResult {
    jwt: string;
    expires_at: number;
}
