import { useEffect, useState } from "react";
import StripeCheckOut from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order expired</div>
    }
    const msLeft = new Date(order.expiresAt) - new Date();
    return <div>{timeLeft} seconds until order expires
    <StripeCheckOut
        token={({id}) => doRequest({token: id})}
        stripeKey="pk_test_51O9S1CBW5Tv4OB2kRuRZiLfWRJGsaYMcDiAxKSwXAVaKaUFSwQD8OkHciahDFDVNxybv30Obm1hVenlOACy6AVG600MzCQod0v"
        amount={order.ticket.price * 100}
        email={currentUser.email}/>
        {errors}
    </div>
}

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data};
}

export default OrderShow;