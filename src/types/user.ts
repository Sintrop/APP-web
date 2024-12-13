export interface UserApiProps {
    id: string;
    wallet: string;
    name: string;
    imgProfileUrl: string;
    userType: number;
    address: string;
    propertyGeolocation: string
    zones: string;
    geoLocation: string;
}

export interface AddressProps {
    zipCode: string;
    state: string;
    city: string;
    complement: string;
    street: string;
    country: string;
    areaProperty: number;
}

export interface ProducerProps {
    id: number;
    producerWallet: string;
    name: string;
    proofPhoto: string;
    pendingInspection: boolean
    totalInspections: number;
    lastRequestAt: number;
    isa: {
        isaScore: number;
        isaAverage: number;
        sustainable: boolean
    },
    areaInformation: {
        coordinates: string;
        totalArea: number;
    },
    pool: {
        currentEra: number;
        onContractPool: string;
    }
    userType: 1
}

export interface InvitationProps{
    createdAtBlock: string;
    invited: string;
    inviter: string;
    userType: string;
}

export type UserTypeProps = 1 | 2 | 3 | 4 | 5;