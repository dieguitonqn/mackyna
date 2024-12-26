export interface Medicion {
    userID: string;
    date: string;
    weigth: number;
    IMC: number;
    body_fat: number;
    body_musc: number;
    visceral_fat: number;
    body_age: number;

}

export interface Metric {
    userID: string;
    date: Date;
    weigth: number;
    IMC: number;
    body_fat: number;
    body_musc: number;
    visceral_fat: number;
    body_age: number;
}