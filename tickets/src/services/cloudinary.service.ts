

export async function uploadToCloudinary(base64Image: string) {
  const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dvxfixf5q/image/upload';
  const cloudinaryApiKey = '431122752423812';
  const cloudinaryApiSecret = 'fVCKQfYd94d2zZBtO8qVLqCYX44';

  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${btoa(`${cloudinaryApiKey}:${cloudinaryApiSecret}`)}`,
    },
    body: JSON.stringify({
      file: `data:image/png;base64,${base64Image}`,
      upload_preset: 'ijhjeqin', // Set your Cloudinary upload preset
    }),
  });

  return response.json();
};



