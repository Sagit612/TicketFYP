import axios from "axios";

export default ({ req }) => {
    if (typeof window === 'undefined'){
        // we are on the server
        return axios.create({ // to create instance of axios with a custom config
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else {
        // we are on the browser
        return axios.create({
            baseURL: '/'
        })
    }
}