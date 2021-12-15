export interface serviceReturnForm {
    status: number;
    message: string;
    responseData: Object;
}

export const getYesterday = () => {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    d.setSeconds(59);
    d.setMilliseconds(0);
    d.setHours(32);
    d.setMinutes(59);
    return d;
};
