import { NextRequest, NextResponse } from 'next/server';
import { config } from 'dotenv';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { mapShipHeroToPostNL } from '@/app/utils/postnl/dataMaper';
import { ShipHeroWebhook } from '@/app/utils/types';

import { postNLData } from '@/app/utils/postnl/postnltypes';
import { logger } from '@/utils/logger';
import { dataMapToDhl } from '@/app/utils/dhl/mapperFunction';

config();

export async function POST(req: NextRequest) {
  const shipmentUrl = "https://api-gw.dhlparcel.nl/shipments"
  try {
    if (req.method === 'POST') {
      const shipmentData: ShipHeroWebhook = await req.json();
      logger.info(JSON.stringify(shipmentData));
      const {accessToken} = await authenticateApiKey()
      console.log(accessToken)
    
      


      const dhlrequestBody : dhlShipment =  dataMapToDhl(shipmentData );
      console.log(dhlrequestBody)
       logger.info(JSON.stringify(dhlrequestBody))
      try {
        const dhlResponse  = await callDhlApi(accessToken, JSON.stringify(dhlrequestBody));
        console.log(dhlResponse)
        logger.info(JSON.stringify(dhlResponse))
        return new NextResponse(JSON.stringify(dhlResponse), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log("error")
        //return handlePostNLError(error);
      }
    } else {
      return new NextResponse('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    logger.error('Error processing the shipment update:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function authenticateApiKey() {
  const url = 'https://api-gw.dhlparcel.nl/authenticate/api-key';

  const data = {
    userId: 'd1e5f062-4c44-4c49-8d6e-d7afc5d98575',
    key: '939b8696-2a0c-4e7c-916e-bf3eb808f653'
  };

  try {
    const response = await axios.post(url, data);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function callDhlApi(accessToken: string, requestPayload: any ) {
  const shipmentUrl = "https://api-gw.dhlparcel.nl/shipments"
  try {
    const headers = {
      'Content-Type': 'application/json',
      'api_key': accessToken,
    };

    const response: AxiosResponse<any> = await axios.post(shipmentUrl, requestPayload, {
      headers,
      timeout: 10000,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.log("error")
    throw error;
  }
}



// function handlePostNLError(error: any) {
//   if (axios.isAxiosError(error)) {
//     const errorResponse = error.response;
//     if (errorResponse) {
//       const statusCode = errorResponse.status;
//       const errorData = errorResponse.data;
  
//       if (statusCode === 400) {
//         const errors = errorData.Errors.map((error: any) => ({
//           code: error.Code,
//           description: error.Description,
//         }));
//         return new NextResponse(JSON.stringify({ statusCode, errors }), {
//           status: 400,
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//       } else if (statusCode === 401) {
//         return new NextResponse('Invalid API key', { status: 401 });
//       } else if (statusCode === 405) {
//         return new NextResponse('Method not allowed', { status: 405 });
//       } else if (statusCode === 429) {
//         return new NextResponse('Too many requests', { status: 429 });
//       } else {
//         return new NextResponse('Internal server error', { status: 500 });
//       }
//     } else {
//       return new NextResponse('Internal server error', { status: 500 });
//     }
//   } else {
    
//     return new NextResponse('Internal server error', { status: 500 });
//   }
// }
