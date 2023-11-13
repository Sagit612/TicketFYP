import { body } from 'express-validator';
import axios from "axios";
import QueryString from "qs";

interface GoogleOauthToken {
    access_token: string;
    id_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
  }

export async function getGoogleOauthToken (
     code: string
    ) : Promise<GoogleOauthToken> {
    if(!process.env.GOOGLE_CLIENT_ID) {
        throw new Error('GOOGLE_CLIENT_ID must be defined')
    }
    if(!process.env.GOOGLE_CLIENT_SECRET){
        throw new Error('GOOGLE_CLIENT_SECRET must be defined')
    }
    const rootUrl = 'https://oauth2.googleapis.com/token';
    const postOptions = {
        code: code,
        client_id: '1064906767052-lemu93dod3focc8usrjlg1069nlc737p.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'https://ticketing.dev/api/users/oauth/google',
        grant_type: "authorization_code",
    };
    try {
        const { data }  = await axios.post<GoogleOauthToken>(
            rootUrl,
            QueryString.stringify(postOptions),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
        return data;
    } catch (error: any) {
        console.log('Failed to fetch Google Oauth Tokens');
        throw new Error(error);
    }    
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    picture: string;
}

export async function getGoogleUser(
    {
        id_token,
        access_token
    }: {
        id_token: string;
        access_token: string;
    }
): Promise<GoogleUserResult> {
    try {
        const { data } = await axios.get<GoogleUserResult>(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                }
            }
        );
        return data;
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}
