// import axios from 'axios';

// export  async function uploadPdf() {
//   try {
//     const body = {
//       files :[
//                 {
//                     name: 'def',
//                     size: 75248+5%,
//                     type: 'pdf',
//                     customsid: 'def',

//                 }
//       ]
//     };
    

//     const response = await axios.post('https://uploadthings/api/uploadfile', JSON.stringify(body) , {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Uploadthing-Api-Key': '    ',
//       },
//     });

//     console.log('Upload successful. Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw error;
//   }
// }
