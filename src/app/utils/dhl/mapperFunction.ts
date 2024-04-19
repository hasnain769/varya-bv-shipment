import { ShipHeroWebhook } from "../types";

export function dataMapToDhl(data: ShipHeroWebhook) {
  const shipment: dhlShipment = {
    shipmentId: data.order_number,
    orderReference: data.partner_order_id,
    receiver: {
      name: {
        firstName: data.to_address.name.split(" ")[0],
        lastName: data.to_address.name.split(" ")[1] || "",
        companyName: data.to_address.company_name || "",
        additionalName: ""
      },
      address: {
        countryCode: data.to_address.country,
        postalCode: data.to_address.zip,
        city: data.to_address.city,
        street: `${data.to_address.address_1} ${data.to_address.address_2}`.trim(),
        additionalAddressLine: "",
        number: "",
        isBusiness: true,
        addition: ""
      },
      email: data.to_address.email,
      phoneNumber: data.to_address.phone,
      vatNumber: "", // This value is not provided in the given data
      eoriNumber: "", // This value is not provided in the given data
      reference: "" // This value is not provided in the given data
    },
    shipper: {
      name: {
        firstName: data.from_address.name.split(" ")[0],
        lastName: data.from_address.name.split(" ")[1] || "",
        companyName: data.from_address.company_name || "",
        additionalName: ""
      },
      address: {
        countryCode: data.from_address.country,
        postalCode: data.from_address.zip,
        city: data.from_address.city || "any",
        street: `${data.from_address.address_1} ${data.from_address.address_2}`.trim(),
        additionalAddressLine: "",
        number: "",
        isBusiness: true,
        addition: ""
      },
      email: data.from_address.email,
      phoneNumber: data.from_address.phone,
      vatNumber: "", // This value is not provided in the given data
      eoriNumber: "", // This value is not provided in the given data
      rexNumber: "" // This value is not provided in the given data
    },
    accountId: data.account_id.toString(),
    options: [
      {
        key: "PS",
        input: data.shipping_method
      }
    ],
    onBehalfOf: {
      name: {
        firstName: "James",
        lastName: "Johnson",
        companyName: "DHL",
        additionalName: ""
      },
      address: {
        countryCode: "DE",
        postalCode: "50667",
        city: "Cologne",
        street: "Bonnstraße",
        additionalAddressLine: "",
        number: "1",
        isBusiness: true,
        addition: ""
      },
      email: "james.johnson@dhl.com",
      phoneNumber: "004922123456789",
      vatNumber: "DE987654321",
      eoriNumber: "DE123456789",
      rexNumber: "DEREX12345678"
    },
    product: "Express",
    customsDeclaration: {
      certificateNumber: "123",
      currency: "USD",
      invoiceNumber: "INV-123",
      licenceNumber: "LIC-123",
      remarks: "No remarks",
      invoiceType: "Commercial",
      exportType: "Permanent",
      exportReason: "Gift",
      customsGoods: data.packages.map((pkg : any) => ({
        code: pkg.line_items[0].sku,
        description: pkg.line_items[0].customs_description,
        origin: "NL", // Assuming it's always NL
        quantity: pkg.line_items[0].quantity,
        value: parseFloat(pkg.line_items[0].customs_value),
        weight: pkg.line_items[0].weight 
      })),
      incoTerms: "", // This value is not provided in the given data
      incoTermsCity: "", // This value is not provided in the given data
      senderInboundVatNumber: "NL987654321",
      attachmentIds: [],
      shippingFee: {
        currency: "EUR", // Assuming conversion rate is handled separately
        value: 20 // Assuming it's a fixed value
      },
      importerOfRecord: {
        name: {
          firstName: "Importer",
          lastName: "Johnson",
          companyName: "Importer Co.",
          additionalName: ""
        },
        address: {
          countryCode: "NL",
          postalCode: "3542AD",
          city: "Utrecht",
          street: "Reactorweg",
          additionalAddressLine: "",
          number: "25",
          isBusiness: true,
          addition: ""
        },
        email: "importer@example.com",
        phoneNumber: "0031612345678",
        vatNumber: "NL007096100B01",
        eoriNumber: "NL123456789",
        reference: "Importer reference"
      },
      defermentAccountDuties: "123456",
      defermentAccountVat: "987654",
      vatReverseCharge: true
    },
    returnLabel: false,
    pieces: data.packages.map(pkg => ({
      parcelType: "SMALL",
      quantity: pkg.line_items?.length ,
      weight: pkg.weight_in_oz * 0.0283495, // Convert oz to kg
      dimensions: {
        length: pkg.length,
        width: pkg.width,
        height: pkg.height
      }
    }))
    
  };
  console.log(JSON.stringify(shipment))
  return shipment ;
}