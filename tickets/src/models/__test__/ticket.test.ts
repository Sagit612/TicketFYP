import { TicketModel } from "../ticket.model";

// https://www.mongodb.com/community/forums/t/mongoose-version-error-no-matching-document-found-for-id/134781/2

it('implements optimistic concurrency', async () => {
    // Create an instance of a ticket
    const ticket  = TicketModel.createTicket({
        title: 'concert',
        price: 5,
        userId: '123'
    });
    // Save the ticket to the database
    await ticket.save();
    // fetch the ticket twice
    const firstInstance = await TicketModel.findById(ticket.id);
    const secondInstance = await TicketModel.findById(ticket.id);
    // make two separate changes to the tickets we fetched  
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});
    // save the first fetched ticket
    await firstInstance!.save();
    // save the second fetched ticket
    try {
        await secondInstance!.save();    
    } catch (err) {
        return;
    }
    throw new Error('Should not reach this point')
    
});

it('increments the version number on multiple saves', async () => {
    const ticket = TicketModel.createTicket({
        title: 'concert',
        price: 20,
        userId: '123'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})