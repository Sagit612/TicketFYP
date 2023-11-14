import useRequest from "../../hooks/use-request";
import Router  from 'next/router';

const TicketShow = ({currentUser, ticket}) => {
    console.log(ticket);
    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });
    return <div className="d-flex justify-content-around">
        <h1>{ticket.title}</h1>
        <h1>Price: {ticket.price}</h1>
        {errors}
        {(!currentUser) || (currentUser.id !== ticket.userId) ? <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button> : null}
        {/* <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button> */}
    </div>
};

TicketShow.getInitialProps = async (context, client) => {
    const {ticketId} = context.query;
    const {data} = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data}
}

export default TicketShow;