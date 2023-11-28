import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
    const ticketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>
                    <img src={ticket.photo_url} class="img-thumbnail" alt="..."/>
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.price}$</td>
                <td>    
                    <button className="btn btn-primary">
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`} className="nav-link">
                        View
                    </Link>
                    </button> 
                    {
                        currentUser !== null ? (currentUser.id !== ticket.userId ? null : 
                            <button className="btn btn-warning">
                            <Link href='/tickets/edit/[ticketId]' as={`/tickets/edit/${ticket.id}`} className="nav-link">
                                Edit
                            </Link>
                            </button>  ) : null
                    }
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