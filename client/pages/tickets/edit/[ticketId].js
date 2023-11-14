import {useState} from 'react';
import useRequest from '../../../hooks/use-request';
import Router, { useRouter }  from 'next/router';

const EditTicket = ({ticket}) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const {doRequest, errors} = useRequest({
        url: `https://ticketing.dev/api/tickets/${ticket.id}`,
        method: 'put',
        body: {
            title: title,
            price: price,
        },
        onSuccess: () => Router.push('/')
    })
    const onSubmit = async (event) => {
        event.preventDefault();
        if (selectedImage) {
            const base64Image = await readFileAsBase64(selectedImage);
            // Update the request body with the Base64-encoded image data
            doRequest({ ...doRequest.body, photo: base64Image });
        } else {
            // No image selected, proceed with the existing body
            doRequest();
        }
    }
    const onBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    }
    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result.split(',')[1]); // Extract the Base64-encoded part
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      };

    const imgChange = () => {
        var img = document.getElementById("ticketImg");
        img.src=image;
    }
    return (
        <div>
            <br/>
            <h1>Edit Ticket</h1>
            <form onSubmit={onSubmit}>

            {selectedImage && (
                <div>
                <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(selectedImage)}
                />
                <br />
                <button onClick={
                    () => setSelectedImage(null)
                }>Remove</button>
                </div>
            )}
            <input
                type="file"
                name="myImage"
                accept="image/png, image/jpeg"
                onChange={(event) => {
                console.log(event.target.files[0]);
                setSelectedImage(event.target.files[0]);
                }}
            />
                <div className="form-group">
                    <label>Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder={ticket.title} className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input value={price} onBlur={onBlur} onChange={e => setPrice(e.target.value)} placeholder={ticket.price} className="form-control"/>
                </div>
                {errors}
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

EditTicket.getInitialProps = async (context, client) => {
    const {ticketId} = context.query;
    const {data} = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data}
}
export default EditTicket;