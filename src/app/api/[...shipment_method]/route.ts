import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ShipHeroWebhook } from '@/app/utils/types';
import { CustomerDetailsType, ShipmentDetailsType, ShipmentItemsType, ShipmentStatusType } from '@/lib/db/schema';
import { insertCustomerDetails, insertShipmentDetails, insertShipmentItems, insertShipmentStatus, } from '@/lib/db/dboperations';
import { uploadPdf } from '@/app/utils/labelPdfUrlGenerator';
import { withAxiom, AxiomRequest } from 'next-axiom';

export const POST = withAxiom(async (req: AxiomRequest) => {

 


  let trackingNumber = '';
  let trackingUrl = ''
  let labelUrl = undefined;
  const postnlCallingapilocal = "http://localhost:3000/api/postnl/label"
  const postnlCallingapiProd = "https://vareyaship.vercel.app/api/postnl/label"

  try {

    if (req.method === 'POST') {
      const shipmentData: ShipHeroWebhook = await req.json();


      const firstPackage = shipmentData.packages[0];

      const Weight = firstPackage.weight_in_oz * 28.3495;
      const { shipping_method, order_id, order_number, to_address, packages } = shipmentData;

      if (!shipping_method || !order_id || !order_number || !to_address || !packages) {
        return new NextResponse('One or more required fields are missing.', { status: 400 });
      }

      if (!Array.isArray(packages) || packages.length === 0 || !packages[0].weight_in_oz || !packages[0].width || !packages[0].length || !packages[0].height) {
        return new NextResponse('Package information is missing or invalid.', { status: 400 });
      }

      if (!to_address.name || !to_address.address_1 || !to_address.city || !to_address.zip || !to_address.country) {
        return new NextResponse('One or more destination address fields are missing.', { status: 400 });
      }
      let Carrier : string =''
      const postNL: string[] = [
        "NL Mailbox Package UnSorted 2928",
        "NL Mailbox Package Sorted 2929",
        "NL Standard 3085",
        "BE Standard 4946",
        "ROW Packet Track n Trace 6550",
        "ROW Boxable Track n Trace 6942"
    ];
    const asendia: string[] = [
      "Asendia e-PAQ Plus",
      "Asendia e-PAQ Plus Personal Delivery",
      "Asendia e-PAQ Plus Mailbox Delivery",
      "Asendia e-PAQ Select",
      "Asendia e-PAQ Select Signature",
      "Asendia e-PAQ Plus - Boxable",
      "Asendia e-PAQ Plus Personal Delivery - Boxable",
      "Asendia e-PAQ Plus Mailbox Delivery - Boxable"
  ];
    if(asendia.includes(shipmentData.shipping_method)){
      Carrier ="Asendia"
    } else if(postNL.includes(shipmentData.shipping_method)){
      Carrier="PostNL"
    }
    console.log(Carrier)
      let labelContent = undefined;
      if (Carrier ==="PostNL") {
        

        const postNLApiResponse = await axios.post(postnlCallingapilocal, shipmentData);
    
        if (postNLApiResponse.data.ResponseShipments.length > 0 && postNLApiResponse.data.ResponseShipments[0].Labels.length > 0) {
          trackingUrl = `https://postnl.post/#/tracking/items/${postNLApiResponse.data.ResponseShipments[0].Barcode}`
          trackingNumber = postNLApiResponse.data.ResponseShipments[0].Barcode
          labelContent = postNLApiResponse.data.ResponseShipments[0].Labels[0].Content;
          req.log.info('Label Generated successfully for order :', { order: shipmentData });
        }


      }
      else if (Carrier ==="Asendia") {
        console.log("first")
        const asendiaResponse = await axios.post("http://localhost:3000/api/asendia", shipmentData)
        console.log(asendiaResponse.data)
        trackingNumber = asendiaResponse.data.sequenceNumber
        labelContent  = asendiaResponse.data.content
        console.log(trackingNumber)
      }
      else {
        return new NextResponse('not found .', { status: 404 });
      }
      var currentdate = new Date();
      var datetime = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-"
        + currentdate.getDay() + "-"
        + currentdate.getHours() +
        + currentdate.getMinutes() + currentdate.getSeconds();
      const filename = `${shipmentData.order_id}-${shipmentData.shipping_method}- ${datetime}`
      labelUrl = await uploadPdf(labelContent, filename)




      const shipmentDetailsData: ShipmentDetailsType = {
        order_id: shipmentData.order_id,
        barcode: trackingNumber,
        name: shipmentData.shop_name,
        cancel_deadline: new Date(),
        shipping_method: shipmentData.shipping_method,
        from_address: shipmentData.to_address.address_1 + "," + shipmentData.to_address.city + "," + shipmentData.to_address.country as string,
        label_url: labelUrl as string
      };

      const customerDetailsData: CustomerDetailsType = {
        customer_name: shipmentData.to_address.name,
        customer_email: shipmentData.to_address.email,
        to_address: shipmentData.to_address.address_1 + "," + shipmentData.to_address.city + "," + shipmentData.to_address.country,
        order_id: shipmentData.order_id,
      };

      const shipmentStatusData: ShipmentStatusType = {
        order_id: shipmentData.order_id,
        status_code: '1',
        status_description: '	Shipment pre-alerted',
        carrier_message: 'Carrier message goes here',
      };

      const shipmentItemsData: ShipmentItemsType = {
        order_id: shipmentData.order_id,
        item_description: 'Example Item',
        quantity: 1,
        unit_price: "10.99",
        shipment_weight: Weight,
      };



      try {
        // Insert into addresses table

        await insertShipmentDetails(shipmentDetailsData);
        //await insertShipmentItems(shipmentItemsData)
        await insertCustomerDetails(customerDetailsData)
        await insertShipmentStatus(shipmentStatusData)

      } catch (error) {
        console.error('Error inserting data:', error);
        req.log.error('Error occured while inserting data to database', { error: error });

      }


      let responseBodyJson = {
        code: 200,
        shipping_method: shipping_method,
        tracking_number: "",
        cost: 0,
        label: labelUrl,
        customs_info: '',
        shipping_carrier: 'PostNL',
        tracking_url: trackingNumber
      };
      const responseBody = JSON.stringify(responseBodyJson);
      return new NextResponse(responseBody, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });  
      
  } 

  else {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
} catch (error) {
  console.error('Error processing the shipment update:', error);

  let errorMessage: any = 'Internal Server Errorsss';
  let status = 500;


  if (axios.isAxiosError(error)) {
    const errorResponse = error.response;
    const axiosError: AxiosError = error;
    if (axiosError.response) {
      const response: AxiosResponse = axiosError.response;
      status = response.status

      errorMessage = JSON.stringify(response.data.errors);
      req.log.error('Error occured while calling Carrier Endpoint :', { error: errorMessage })
    }
  }

  return new NextResponse(errorMessage, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
})
