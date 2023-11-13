import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>
                    <img src="https://www.shutterstock.com/shutterstock/photos/2021147534/display_1500/stock-vector-concert-ticket-template-concert-party-or-festival-ticket-design-template-with-crowd-of-people-in-2021147534.jpg" class="img-thumbnail" alt="..."/>
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.price}$</td>
                <td>    
                    <button className="btn btn-primary">
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`} className="nav-link">
                        View
                    </Link>
                    </button>        
                </td>

            </tr>
        )
    })
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>                        
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get('/api/tickets');
    return { tickets: data};
};

export default LandingPage;