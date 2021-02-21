export interface Player {
    id: number;
    fullName: string;
    firstName: string;
    lastName: string;
    primaryNumber: number;
    birthDate: string;
    currentAge?: number;
    birthCity: string;
    birthCountry: string;
    nationality: string;
    height: string;
    weight: number;
    active: boolean;
    alternateCaptain?: boolean;
    captain?: boolean;
    rookie: boolean;
    shootsCatches: string;
    rosterStatus: string;
    currentTeamId?: number;
    primaryPosition: string;
}
