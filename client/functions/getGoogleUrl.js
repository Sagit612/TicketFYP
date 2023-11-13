export const getGoogleUrl = () => {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;
  
    const options = {
      redirect_uri: 'https://ticketing.dev/api/users/oauth/google',
      prompt: 'consent',
      response_type: 'code',
      client_id: '1064906767052-lemu93dod3focc8usrjlg1069nlc737p.apps.googleusercontent.com',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      access_type: 'offline',
    };
  
    const qs = new URLSearchParams(options);
  
    return `${rootUrl}?${qs.toString()}`;
  };