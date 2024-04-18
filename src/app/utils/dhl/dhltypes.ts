interface Name {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  additionalName?: string;
}

interface Address {
  countryCode?: string;
  postalCode?: string;
  city?: string;
  street?: string;
  additionalAddressLine?: string;
  number?: string;
  isBusiness?: boolean;
  addition?: string;
}

interface dhlShipment {
  shipmentId?: string;
  orderReference?: string;
  receiver?: {
    name?: Name;
    address?: Address;
    email?: string;
    phoneNumber?: string;
    vatNumber?: string;
    eoriNumber?: string;
    reference?: string;
  };
  shipper?: {
    name?: Name;
    address?: Address;
    email?: string;
    phoneNumber?: string;
    vatNumber?: string;
    eoriNumber?: string;
    rexNumber?: string;
  };
  accountId?: string;
  options?: {
    key?: string;
    input?: string;
  }[];
  onBehalfOf?: {
    name?: Name;
    address?: Address;
    email?: string;
    phoneNumber?: string;
    vatNumber?: string;
    eoriNumber?: string;
    rexNumber?: string;
  };
  product?: string;
  customsDeclaration?: {
    certificateNumber?: string;
    currency?: string;
    invoiceNumber?: string;
    licenceNumber?: string;
    remarks?: string;
    invoiceType?: string;
    exportType?: string;
    exportReason?: string;
    customsGoods?: {
      code?: string;
      description?: string;
      origin?: string;
      quantity?: number;
      value?: number;
      weight?: number;
    }[];
    incoTerms?: string;
    incoTermsCity?: string;
    senderInboundVatNumber?: string;
    attachmentIds?: string[];
    shippingFee?: {
      currency?: string;
      value?: number;
    };
    importerOfRecord?: {
      name?: Name;
      address?: Address;
      email?: string;
      phoneNumber?: string;
      vatNumber?: string;
      eoriNumber?: string;
      reference?: string;
    };
    defermentAccountDuties?: string;
    defermentAccountVat?: string;
    vatReverseCharge?: boolean;
  };
  returnLabel?: boolean;
  pieces?: {
    parcelType?: string;
    quantity?: number;
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
  }[];
}