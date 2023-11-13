import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import Link from "next/link";
import { getGoogleUrl } from '../../functions/getGoogleUrl';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { doRequest, errors } = useRequest(
        { 
            url: 'https://ticketing.dev/api/users/signin', 
            method: 'post', 
            body: {
                email: email, 
                password: password,
                name: name
            },
            onSuccess: () => Router.push('/')
        }
    );

    const onSubmit = async event => {
        event.preventDefault();
        await doRequest();
    }
      

    return (
        <div>
            {/* <form onSubmit={onSubmit}>
                <h1>Sign in</h1>
                <div className="form-group">
                    <label>Email Address</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control"/>
                </div>
                {errors}
                <button className="btn btn-primary">Sign In</button>
            </form>
             */}
            <form onSubmit={onSubmit}>
            <div className="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"
                    value={email} onChange={e => setEmail(e.target.value)}
                />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                    value={password} onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                <label className="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <a href={getGoogleUrl()}>Login by Google</a>
        </div>
        
    )
}