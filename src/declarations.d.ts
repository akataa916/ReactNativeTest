declare module 'react-native-config' {
    export interface NativeConfig {
        MOVIE_DB_TOKEN?: string;
        GOOGLE_SIGNIN_CLIENT_ID?: string;
    }

    export const Config: NativeConfig;
    export default Config;
}
