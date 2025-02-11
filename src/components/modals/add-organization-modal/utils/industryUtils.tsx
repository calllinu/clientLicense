import {Industry} from "../../../../interfaces/enums/IndustryInterfaces.tsx";

export const formatIndustry = (industry: Industry | null): string => {
    switch (industry) {
        case Industry.CONSTRUCTION:
            return "Construction";
        case Industry.AGRICULTURE:
            return "Agriculture";
        case Industry.MINING:
            return "Mining";
        case Industry.TRANSPORT_AND_LOGISTICS:
            return "Transport and Logistics";
        case Industry.MANUFACTURING:
            return "Manufacturing";
        default:
            return "Unknown Industry";
    }
};
